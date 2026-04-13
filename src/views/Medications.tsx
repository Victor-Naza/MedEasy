import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Pill, Heart, ShieldCheck, Zap, ArrowLeft, Droplets, Tablet, Loader2 } from 'lucide-react';

interface Categoria {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  quantidade_medicamentos: number;
}

interface Medicamento {
  id: number;
  nome: string;
  principio_ativo?: string;
  apresentacao: string;
  via_administracao: string;
  concentracao?: string;
  unidade_dose?: string;
  categoria?: string;
}

const API_BASE_URL = 'http://localhost:5000/api/medicamentos';

const Medications: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<Medicamento | null>(null);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingMedicamentos, setLoadingMedicamentos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCorIcone = (icone: string) => {
    const cores: Record<string, string> = {
      heart: 'bg-red-500',
      zap: 'bg-yellow-500',
      'shield-check': 'bg-green-500',
      shield: 'bg-purple-500',
      pill: 'bg-purple-500',
    };
    return cores[icone] || 'bg-blue-500';
  };

  const getIconComponent = (icone: string) => {
    const icons: Record<string, any> = {
      heart: Heart,
      'shield-check': ShieldCheck,
      zap: Zap,
      shield: ShieldCheck,
    };
    return icons[icone] || Pill;
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    if (categoriaAtiva) carregarMedicamentos(categoriaAtiva);
  }, [categoriaAtiva]);

  const carregarCategorias = async () => {
    setLoadingCategorias(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`);
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      setCategorias(await response.json());
    } catch {
      setError('Erro ao carregar categorias');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const carregarMedicamentos = async (categoriaId: number) => {
    setLoadingMedicamentos(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/categoria/${categoriaId}`);
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      setMedicamentos(await response.json());
    } catch {
      setError('Erro ao carregar medicamentos');
    } finally {
      setLoadingMedicamentos(false);
    }
  };

  const voltarParaCategorias = () => {
    setCategoriaAtiva(null);
    setMedicamentos([]);
    setMedicamentoSelecionado(null);
    setError(null);
  };

  const voltarParaMedicamentos = () => {
    setMedicamentoSelecionado(null);
    setError(null);
  };

  // Tela de detalhe do medicamento
  if (medicamentoSelecionado) {
    return (
      <Layout title="Medicamentos">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={voltarParaMedicamentos}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Tablet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{medicamentoSelecionado.nome}</h1>
                {medicamentoSelecionado.principio_ativo && (
                  <p className="text-gray-500 text-sm">{medicamentoSelecionado.principio_ativo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Apresentação</p>
                <p className="font-medium text-gray-900">{medicamentoSelecionado.apresentacao}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Via de Administração</p>
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900">{medicamentoSelecionado.via_administracao}</p>
                </div>
              </div>

              {medicamentoSelecionado.concentracao && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Concentração</p>
                  <p className="font-medium text-gray-900">{medicamentoSelecionado.concentracao}</p>
                </div>
              )}

              {medicamentoSelecionado.unidade_dose && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Unidade de Dose</p>
                  <p className="font-medium text-gray-900">{medicamentoSelecionado.unidade_dose}</p>
                </div>
              )}

              {medicamentoSelecionado.categoria && (
                <div className="bg-blue-50 rounded-lg p-4 md:col-span-2">
                  <p className="text-xs text-blue-500 uppercase tracking-wide mb-1">Categoria</p>
                  <p className="font-medium text-blue-900">{medicamentoSelecionado.categoria}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Tela de medicamentos da categoria
  if (categoriaAtiva) {
    const categoriaNome = categorias.find(c => c.id === categoriaAtiva)?.nome || '';
    return (
      <Layout title="Medicamentos">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={voltarParaCategorias}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </button>

          <div className="flex items-center mb-6">
            <Pill className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">{categoriaNome}</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loadingMedicamentos ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando medicamentos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicamentos.map((med) => (
                <div
                  key={med.id}
                  onClick={() => setMedicamentoSelecionado(med)}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{med.nome}</h3>
                      {med.principio_ativo && (
                        <p className="text-sm text-gray-500">{med.principio_ativo}</p>
                      )}
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg ml-3">
                      <Tablet className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {med.apresentacao && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {med.apresentacao}
                      </span>
                    )}
                    {med.concentracao && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {med.concentracao}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {med.via_administracao}
                    </span>
                  </div>
                </div>
              ))}

              {medicamentos.length === 0 && !loadingMedicamentos && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  Nenhum medicamento encontrado nesta categoria.
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Tela de categorias
  return (
    <Layout title="Medicamentos">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Pill className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicamentos</h1>
          <p className="text-gray-600">Selecione uma categoria para ver os medicamentos disponíveis</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={carregarCategorias} className="text-red-800 underline hover:no-underline text-sm">
              Tentar novamente
            </button>
          </div>
        )}

        {loadingCategorias ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando categorias...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorias.map((categoria) => {
              const IconComponent = getIconComponent(categoria.icone);
              return (
                <div
                  key={categoria.id}
                  onClick={() => setCategoriaAtiva(categoria.id)}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                >
                  <div className="text-center">
                    <div className={`${getCorIcone(categoria.icone)} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{categoria.nome}</h3>
                    <p className="text-gray-500 text-sm">
                      {categoria.quantidade_medicamentos} medicamentos
                    </p>
                    <div className="mt-4 inline-flex items-center text-blue-600 font-medium text-sm">
                      Ver medicamentos <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </div>
                  </div>
                </div>
              );
            })}

            {categorias.length === 0 && !loadingCategorias && (
              <div className="col-span-3 text-center py-12 text-gray-500">
                Nenhuma categoria encontrada.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medications;
