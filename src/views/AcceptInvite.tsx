import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/auth';

type Status = 'validando' | 'valido' | 'invalido' | 'enviando' | 'sucesso';

const AcceptInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<Status>('validando');
  const [mensagemErro, setMensagemErro] = useState('');
  const [emailConvite, setEmailConvite] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erroForm, setErroForm] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalido');
      setMensagemErro('Link de convite inválido ou incompleto.');
      return;
    }

    const validar = async () => {
      try {
        // Ao chamar esse endpoint, o token do e-mail é revogado imediatamente
        // e recebemos um session token de 30 minutos para concluir o cadastro
        const response = await fetch(`${API_BASE_URL}/convite/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setMensagemErro(data.message || 'Convite inválido.');
          setStatus('invalido');
          return;
        }

        setEmailConvite(data.email);
        setSessionToken(data.sessionToken);
        if (data.name) setName(data.name);
        setStatus('valido');
      } catch {
        setMensagemErro('Não foi possível validar o convite. Tente novamente.');
        setStatus('invalido');
      }
    };

    validar();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm('');

    if (!name.trim()) {
      setErroForm('Informe seu nome completo.');
      return;
    }

    if (password.length < 6) {
      setErroForm('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErroForm('As senhas não coincidem.');
      return;
    }

    setStatus('enviando');

    try {
      const response = await fetch(`${API_BASE_URL}/aceitar-convite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, name: name.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErroForm(data.message || 'Erro ao criar conta.');
        setStatus('valido');
        return;
      }

      sessionStorage.setItem('medicalToken', data.token);

      setStatus('sucesso');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch {
      setErroForm('Erro ao conectar com o servidor. Tente novamente.');
      setStatus('valido');
    }
  };

  if (status === 'validando') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validando seu convite...</p>
        </div>
      </div>
    );
  }

  if (status === 'invalido') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Convite inválido</h2>
          <p className="text-gray-600 mb-6">{mensagemErro}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  if (status === 'sucesso') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Conta criada!</h2>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <UserCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Ativar sua conta</h2>
          <p className="mt-1 text-sm text-gray-500">{emailConvite}</p>
        </div>

        {erroForm && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {erroForm}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. João Silva"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Criar senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'enviando'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 mt-2"
          >
            {status === 'enviando' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Criar minha conta'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvite;
