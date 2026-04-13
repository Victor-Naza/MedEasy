import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LogOut, User, FileText, Calculator, Menu, X, Mic } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Painel de Controle',
      icon: <User className="w-5 h-5" />,
      path: '/dashboard',
      roles: [UserRole.DOCTOR],
    },
    {
      name: 'Criar Prescrição',
      icon: <FileText className="w-5 h-5" />,
      path: '/prescription',
      roles: [UserRole.DOCTOR],
    },
    {
      name: 'Medicamentos',
      icon: <Calculator className="w-5 h-5" />,
      path: '/dosage',
      roles: [UserRole.DOCTOR],
    },
    {
      name: 'Transcrição de Consultas',
      icon: <Mic className="w-5 h-5" />,
      path: '/transcricao',
      roles: [UserRole.DOCTOR],
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(currentUser?.role as UserRole)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden" 
           onClick={() => setSidebarOpen(false)}
           style={{ display: sidebarOpen ? 'block' : 'none' }}></div>
      
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-6 bg-blue-600 text-white">
          <h2 className="text-xl font-semibold">Sistema Médico</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-4 py-4 bg-blue-50">
          <p className="text-sm text-gray-700">Conectado como:</p>
          <p className="font-medium text-blue-700">{currentUser?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
        </div>
        
        <nav className="mt-4 px-2 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Sair</span>
          </button>
        </nav>
      </aside>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">{title}</h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;