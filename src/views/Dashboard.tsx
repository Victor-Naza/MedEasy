import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { FileText, Pill, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isDoctor = currentUser?.role === UserRole.DOCTOR;

  const prescriptionsCount = 0;
  const patientsAttendedCount = 0;
  const activeSessionTime = '0m';

  const stats = [
    {
      id: 1,
      name: 'Prescrições Recentes',
      value: isDoctor ? prescriptionsCount : 'N/A',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      available: isDoctor,
    },
    {
      id: 3,
      name: 'Pacientes Atendidos',
      value: isDoctor ? patientsAttendedCount : patientsAttendedCount,
      icon: <User className="h-6 w-6 text-purple-600" />,
      available: true,
    },
    {
      id: 4,
      name: 'Sessão Ativa',
      value: activeSessionTime,
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      available: true,
    },
  ];

  return (
    <Layout title="Painel de Controle">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Bem-vindo(a), {currentUser?.name}!</h2>
          <p>
            {currentUser?.role === UserRole.DOCTOR
              ? 'Você tem acesso completo a todas as funcionalidades de prescrição médica.'
              : 'Você tem acesso ao registro de pacientes e cálculo de dosagens.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) =>
            stat.available && (
              <div
                key={stat.id}
                className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </div>
            )
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Ações Rápidas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isDoctor && (
            <button
              onClick={() => navigate('/prescription')}
              className="bg-white hover:bg-blue-50 shadow-md rounded-lg p-6 flex items-center space-x-4 border border-gray-100 transition-colors duration-200"
            >
              <div className="rounded-full bg-blue-100 p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Criar Prescrição</h3>
                <p className="text-sm text-gray-500">Gerar uma nova prescrição médica</p>
              </div>
            </button>
          )}

          <button
            onClick={() => navigate('/dosage')}
            className="bg-white hover:bg-green-50 shadow-md rounded-lg p-6 flex items-center space-x-4 border border-gray-100 transition-colors duration-200"
          >
            <div className="rounded-full bg-green-100 p-3">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Medicamentos</h3>
              <p className="text-sm text-gray-500">Consultar medicamentos e calcular dosagens</p>
            </div>
          </button>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Tipo de Usuário:</span>{' '}
              <span className="capitalize">{currentUser?.role}</span>
            </p>
            {currentUser?.role === UserRole.DOCTOR && (
              <p className="text-sm">
                <span className="font-medium">CRM:</span> {currentUser?.crm}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">E-mail:</span> {currentUser?.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Versão do Sistema:</span> 1.0.0
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;