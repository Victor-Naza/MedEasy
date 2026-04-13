const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const Invite = require('../models/invite');
const User = require('../models/user');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/auth/convidar  (requer autenticação JWT)
exports.enviarConvite = async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }

  try {
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Já existe um usuário com este e-mail' });
    }

    // Cancela convites pendentes anteriores para o mesmo e-mail
    await Invite.update(
      { usado: true },
      { where: { email, usado: false } }
    );

    // Cria convite com validade de 24 horas
    const expira_em = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const convite = await Invite.create({ email, name, expira_em });

    const link = `${process.env.FRONTEND_URL}/aceitar-convite?token=${convite.token}`;

    await resend.emails.send({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Você foi convidado para o MedEasy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">MedEasy</h1>
          </div>
          <div style="background-color: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Você foi convidado!</h2>
            ${name ? `<p style="color: #374151;">Olá, <strong>${name}</strong>!</p>` : ''}
            <p style="color: #374151;">
              Você recebeu um convite para acessar o <strong>MedEasy</strong>.
              Clique no botão abaixo para criar sua senha e ativar sua conta.
            </p>
            <p style="color: #374151;">
              O link é válido por <strong>24 horas</strong> e pode ser usado <strong>apenas uma vez</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${link}"
                style="background-color: #2563eb; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Ativar minha conta
              </a>
            </div>
            <p style="color: #6b7280; font-size: 13px;">
              Se você não esperava este convite, pode ignorar este e-mail com segurança.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              MedEasy - Sistema de Gestão Médica
            </p>
          </div>
        </div>
      `,
    });

    res.status(201).json({ message: 'Convite enviado com sucesso', email });
  } catch (error) {
    console.error('❌ Erro ao enviar convite:', error);
    res.status(500).json({ message: 'Erro ao enviar convite', error: error.message });
  }
};

// GET /api/auth/convite/:token  (público)
// Valida o token do e-mail, revoga-o imediatamente e retorna um session token de 30 minutos
exports.validarToken = async (req, res) => {
  const { token } = req.params;

  try {
    const convite = await Invite.findOne({ where: { token } });

    if (!convite) {
      return res.status(404).json({ message: 'Convite não encontrado' });
    }

    if (convite.acessado) {
      return res.status(410).json({ message: 'Este link já foi acessado e não pode ser reutilizado. Solicite um novo convite.' });
    }

    if (convite.usado) {
      return res.status(410).json({ message: 'Este convite já foi utilizado' });
    }

    if (new Date() > new Date(convite.expira_em)) {
      return res.status(410).json({ message: 'Este convite expirou. Solicite um novo convite.' });
    }

    // Revoga o link imediatamente — qualquer nova abertura será bloqueada
    await convite.update({ acessado: true });

    // Gera um session token de 30 minutos para autorizar o envio do formulário
    const sessionToken = jwt.sign(
      { inviteId: convite.id, email: convite.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      email: convite.email,
      name: convite.name,
      sessionToken,
    });
  } catch (error) {
    console.error('❌ Erro ao validar token:', error);
    res.status(500).json({ message: 'Erro ao validar convite', error: error.message });
  }
};

// POST /api/auth/aceitar-convite  (público)
// Recebe o session token (não o token do e-mail) + nome + senha
exports.aceitarConvite = async (req, res) => {
  const { sessionToken, name, password } = req.body;

  if (!sessionToken || !name || !password) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
  }

  let decoded;
  try {
    decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Sessão expirada ou inválida. Solicite um novo convite.' });
  }

  try {
    const convite = await Invite.findByPk(decoded.inviteId);

    if (!convite || convite.usado) {
      return res.status(410).json({ message: 'Este convite já foi utilizado' });
    }

    const usuarioExistente = await User.findOne({ where: { email: convite.email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este e-mail já possui uma conta' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: convite.email,
      password: hashedPassword,
      role: convite.role,
    });

    await convite.update({ usado: true });

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Conta criada com sucesso',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: jwtToken,
    });
  } catch (error) {
    console.error('❌ Erro ao aceitar convite:', error);
    res.status(500).json({ message: 'Erro ao criar conta', error: error.message });
  }
};
