const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  console.log('🔍 Dados recebidos:', req.body); // Debug
  
  const { name, email, password, role, crm } = req.body;

  try {
    console.log('🔍 Verificando usuário existente...'); // Debug
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      console.log('⚠️ Usuário já existe:', email);
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    console.log('🔍 Criando hash da senha...'); // Debug
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('🔍 Criando usuário no banco...'); // Debug
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      crm,
    });

    console.log('✅ Usuário criado com sucesso:', user.id); // Debug

    console.log('🔍 Gerando JWT token...'); // Debug
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log('✅ Registro concluído com sucesso!'); // Debug
    res.status(201).json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        crm: user.crm // ← ADICIONADO
      }, 
      token 
    });
  } catch (err) {
    console.error('❌ Erro completo:', err); // Debug detalhado
    console.error('❌ Stack trace:', err.stack); // Stack trace completo
    res.status(500).json({ message: 'Erro ao registrar', error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log('🔍 Tentativa de login:', req.body.email); // Debug
  
  const { email, password, crm } = req.body; // ← ADICIONADO CRM
  
  try {
    console.log('🔍 Buscando usuário no banco...'); // Debug
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('⚠️ Usuário não encontrado:', email);
      return res.status(400).json({ message: 'Credenciais inválidas' }); // ← Mensagem genérica por segurança
    }

    console.log('🔍 Verificando senha...'); // Debug
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('⚠️ Senha incorreta para:', email);
      return res.status(400).json({ message: 'Credenciais inválidas' }); // ← Mensagem genérica por segurança
    }

    // ← NOVA VALIDAÇÃO: Verificar se o CRM corresponde ao email
    if (crm && user.crm !== crm) {
      console.log('⚠️ CRM não corresponde ao email:', email, 'CRM fornecido:', crm, 'CRM cadastrado:', user.crm);
      return res.status(400).json({ message: 'CRM não corresponde ao email cadastrado' });
    }

    console.log('🔍 Gerando JWT token para login...'); // Debug
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log('✅ Login realizado com sucesso:', email); // Debug
    console.log('🔍 Dados do usuário:', { id: user.id, name: user.name, email: user.email, role: user.role, crm: user.crm }); // Debug
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        crm: user.crm
      }, 
      token 
    });
  } catch (err) {
    console.error('❌ Erro no login:', err); // Debug detalhado
    console.error('❌ Stack trace:', err.stack); // Stack trace completo
    res.status(500).json({ message: 'Erro ao logar', error: err.message });
  }
};