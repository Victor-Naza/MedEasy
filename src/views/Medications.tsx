import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Pill, 
  Baby, 
  User, 
  ShieldCheck, 
  Heart, 
  Zap, 
  Calculator,
  ArrowLeft,
  Weight,
  Droplets,
  Tablet,
  Loader2,
  ChevronDown
} from 'lucide-react';

// Services e tipos
const API_BASE_URL = 'http://localhost:5000/api/medicamentos';

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
  vias: string[];
  concentracao?: string;
  unidade_dose?: string;
  posologias?: any[];
  // Para compatibilidade com o frontend atual
  dosePorKg: number;
  unidade: string;
  observacoes: string;
}

interface MedicamentoAgrupado {
  nomeBase: string;
  principio_ativo?: string;
  variacoes: Medicamento[];
}

interface CalculoDosagem {
  dose: number;
  unidade: string;
  frequencia_dia?: number;
  dose_maxima_dia?: number;
  observacoes?: string;
  gotas?: number; // Novo campo para quantidade de gotas
  explicacao?: string; // Novo campo para explicação do cálculo
  medicamento: {
    nome: string;
    apresentacao: string;
    concentracao?: string;
  };
}

// Service para comunicação com API
const medicamentosService = {
  // Buscar categorias por faixa etária
  async getCategoriasPorFaixaEtaria(faixaEtaria: 'pediatrico' | 'adulto'): Promise<Categoria[]> {
    try {
      console.log('🔍 Buscando categorias para:', faixaEtaria);
      
      const response = await fetch(`${API_BASE_URL}/categorias/${faixaEtaria}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const categorias = await response.json();
      console.log('✅ Categorias recebidas:', categorias);
      
      return categorias;
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw new Error('Erro ao conectar com o servidor');
    }
  },

  // Buscar medicamentos por categoria
  async getMedicamentosPorCategoria(categoriaId: number, faixaEtaria: 'pediatrico' | 'adulto'): Promise<Medicamento[]> {
    try {
      console.log('🔍 Buscando medicamentos:', { categoriaId, faixaEtaria });
      
      const response = await fetch(`${API_BASE_URL}/categoria/${categoriaId}/${faixaEtaria}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const medicamentos = await response.json();
      console.log('✅ Medicamentos recebidos:', medicamentos);
      
      // Formatar para compatibilidade com o frontend atual
      const medicamentosFormatados = medicamentos.map((med: any) => ({
        id: med.id,
        nome: med.nome,
        principio_ativo: med.principio_ativo,
        apresentacao: med.apresentacao,
        vias: med.vias || [med.via_administracao],
        concentracao: med.concentracao,
        unidade_dose: med.unidade_dose,
        posologias: med.posologias,
        // Para compatibilidade
        dosePorKg: med.posologias?.[0]?.dose_mg_kg_min || med.posologias?.[0]?.dose_mg_kg_max || 0,
        unidade: 'mg/kg/dose',
        observacoes: med.posologias?.[0]?.observacoes || ''
      }));
      
      return medicamentosFormatados;
    } catch (error) {
      console.error('❌ Erro ao buscar medicamentos:', error);
      throw new Error('Erro ao conectar com o servidor');
    }
  },

  // Calcular dosagem
  async calcularDosagem(
    medicamentoId: number, 
    faixaEtaria: 'pediatrico' | 'adulto', 
    peso: number, 
    idadeMeses?: number
  ): Promise<CalculoDosagem> {
    try {
      console.log('🔍 Calculando dosagem:', { medicamentoId, faixaEtaria, peso, idadeMeses });
      
      const response = await fetch(`${API_BASE_URL}/calcular-dosagem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicamentoId,
          faixaEtaria,
          peso,
          idadeMeses
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }
      
      const resultado = await response.json();
      console.log('✅ Dosagem calculada:', resultado);
      
      // Verificar se precisa converter para ml e calcular gotas
      if (resultado.medicamento && resultado.medicamento.apresentacao) {
        const isGotas = resultado.medicamento.apresentacao.toLowerCase().includes('gotas') || 
                       resultado.medicamento.apresentacao.toLowerCase().includes('gota') ||
                       resultado.medicamento.apresentacao.toLowerCase().includes('ml');
        
        const isIbuprofeno = resultado.medicamento.nome.toLowerCase().includes('ibuprofeno');
        const isPediatrico = faixaEtaria === 'pediatrico';
        
        // CASO ESPECIAL: Ibuprofeno pediátrico em gotas
        if (isIbuprofeno && isGotas && isPediatrico) {
          resultado.gotas = peso; // 1 gota por kg
          resultado.dose = Math.round((peso * 0.05) * 100) / 100; // ml equivalente
          resultado.unidade = 'ml';
          resultado.explicacao = `Ibuprofeno pediátrico segue a regra de 1 gota por kg de peso. Para ${peso}kg = ${peso} gotas (${resultado.dose}ml).`;
        }
        // Outros medicamentos em gotas
        else if (isGotas && resultado.medicamento.concentracao && resultado.unidade === 'mg') {
          const concentracaoMatch = resultado.medicamento.concentracao.match(/(\d+(?:\.\d+)?)\s*mg\/ml/i);
          if (concentracaoMatch) {
            const concentracaoMgMl = parseFloat(concentracaoMatch[1]);
            const doseMg = resultado.dose;
            resultado.dose = Math.round((doseMg / concentracaoMgMl) * 100) / 100;
            resultado.unidade = 'ml';
            
            // Calcular gotas (1ml = 20 gotas, então 0.05ml = 1 gota)
            resultado.gotas = Math.round(resultado.dose / 0.05);
            
            resultado.explicacao = `Dose calculada: ${peso}kg × dose/kg = ${doseMg}mg. ` +
                                 `Volume: ${doseMg}mg ÷ ${concentracaoMgMl}mg/ml = ${resultado.dose}ml. ` +
                                 `Gotas: ${resultado.dose}ml ÷ 0.05ml/gota = ${resultado.gotas} gotas.`;
          }
        }
      }
      
      return resultado;
    } catch (error) {
      console.error('❌ Erro ao calcular dosagem:', error);
      throw new Error('Erro ao calcular dosagem');
    }
  }
};

// Função para agrupar medicamentos por nome base
const agruparMedicamentos = (medicamentos: Medicamento[]): MedicamentoAgrupado[] => {
  const grupos: { [key: string]: MedicamentoAgrupado } = {};
  
  medicamentos.forEach(medicamento => {
    // Extrair nome base (primeira palavra em minúsculo)
    const nomeBase = medicamento.nome.toLowerCase().split(' ')[0];
    
    if (!grupos[nomeBase]) {
      grupos[nomeBase] = {
        nomeBase: medicamento.nome.split(' ')[0], // Manter capitalização original
        principio_ativo: medicamento.principio_ativo,
        variacoes: []
      };
    }
    
    grupos[nomeBase].variacoes.push(medicamento);
  });
  
  // Ordenar variações por apresentação
  Object.values(grupos).forEach(grupo => {
    grupo.variacoes.sort((a, b) => a.apresentacao.localeCompare(b.apresentacao));
  });
  
  return Object.values(grupos).sort((a, b) => a.nomeBase.localeCompare(b.nomeBase));
};

const Medications: React.FC = () => {
  const [secaoAtiva, setSecaoAtiva] = useState<'pediatrico' | 'adulto' | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentosAgrupados, setMedicamentosAgrupados] = useState<MedicamentoAgrupado[]>([]);
  const [medicamentoBaseSelecionado, setMedicamentoBaseSelecionado] = useState<MedicamentoAgrupado | null>(null);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState<Medicamento | null>(null);
  const [peso, setPeso] = useState('');
  const [resultadoCalculo, setResultadoCalculo] = useState<CalculoDosagem | null>(null);
  
  // Estados de loading
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingMedicamentos, setLoadingMedicamentos] = useState(false);
  const [loadingCalculo, setLoadingCalculo] = useState(false);
  
  // Estados de erro
  const [error, setError] = useState<string | null>(null);

  // Mapear cores dos ícones
  const getCorIcone = (icone: string) => {
    if (icone === 'heart') return 'bg-red-500';
    if (icone === 'zap') return 'bg-yellow-500';
    if (icone === 'shield-check') return 'bg-green-500';
    if (icone === 'shield') return 'bg-purple-500';
    if (icone === 'pill') return 'bg-purple-500';
    return 'bg-blue-500';
  };
  
  const getIconComponent = (icone: string) => {
    const iconMap: { [key: string]: any } = {
      'heart': Heart,
      'shield-check': ShieldCheck,
      'zap': Zap,
      'shield': ShieldCheck
    };
    return iconMap[icone] || Pill;
  };

  // Carregar categorias quando seleciona uma seção
  useEffect(() => {
    if (secaoAtiva) {
      carregarCategorias();
    }
  }, [secaoAtiva]);

  // Carregar medicamentos quando seleciona uma categoria
  useEffect(() => {
    if (categoriaAtiva && secaoAtiva) {
      carregarMedicamentos();
    }
  }, [categoriaAtiva, secaoAtiva]);

  // Agrupar medicamentos quando carregados
  useEffect(() => {
    if (medicamentos.length > 0) {
      const agrupados = agruparMedicamentos(medicamentos);
      setMedicamentosAgrupados(agrupados);
    }
  }, [medicamentos]);

  const carregarCategorias = async () => {
    if (!secaoAtiva) return;
    
    setLoadingCategorias(true);
    setError(null);
    
    try {
      const categoriasData = await medicamentosService.getCategoriasPorFaixaEtaria(secaoAtiva);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const carregarMedicamentos = async () => {
    if (!categoriaAtiva || !secaoAtiva) return;
    
    setLoadingMedicamentos(true);
    setError(null);
    
    try {
      const medicamentosData = await medicamentosService.getMedicamentosPorCategoria(categoriaAtiva, secaoAtiva);
      setMedicamentos(medicamentosData);
    } catch (err) {
      setError('Erro ao carregar medicamentos');
      console.error('Erro ao carregar medicamentos:', err);
    } finally {
      setLoadingMedicamentos(false);
    }
  };

  const calcularDose = async () => {
    if (!variacaoSelecionada || !peso || !secaoAtiva) return;
    
    setLoadingCalculo(true);
    setError(null);
    
    try {
      const resultado = await medicamentosService.calcularDosagem(
        variacaoSelecionada.id,
        secaoAtiva,
        parseFloat(peso)
      );
      setResultadoCalculo(resultado);
    } catch (err) {
      // Se a API falhar, usar cálculo local como fallback
      console.warn('API falhou, usando cálculo local:', err);
      const pesoNum = parseFloat(peso);
      
      // Detectar se é gotas para converter para ml
      const isGotas = variacaoSelecionada.apresentacao.toLowerCase().includes('gotas') || 
                     variacaoSelecionada.apresentacao.toLowerCase().includes('gota') ||
                     variacaoSelecionada.apresentacao.toLowerCase().includes('ml');
      
      const isIbuprofeno = variacaoSelecionada.nome.toLowerCase().includes('ibuprofeno');
      const isPediatrico = secaoAtiva === 'pediatrico';
      
      let doseMg = pesoNum * variacaoSelecionada.dosePorKg;
      let doseCalculada = doseMg;
      let unidadeResultado = 'mg';
      let quantidadeGotas: number | undefined;
      let explicacaoCalculo = '';
      
      // CASO ESPECIAL: Ibuprofeno pediátrico em gotas
      if (isIbuprofeno && isGotas && isPediatrico) {
        quantidadeGotas = pesoNum; // 1 gota por kg
        doseCalculada = quantidadeGotas * 0.05; // ml equivalente
        unidadeResultado = 'ml';
        explicacaoCalculo = `Ibuprofeno pediátrico segue a regra de 1 gota por kg de peso. Para ${pesoNum}kg = ${quantidadeGotas} gotas (${doseCalculada}ml).`;
      }
      // Outros medicamentos em gotas
      else if (isGotas && variacaoSelecionada.concentracao) {
        // Extrair concentração (ex: "20mg/ml" -> 20)
        const concentracaoMatch = variacaoSelecionada.concentracao.match(/(\d+(?:\.\d+)?)\s*mg\/ml/i);
        if (concentracaoMatch) {
          const concentracaoMgMl = parseFloat(concentracaoMatch[1]);
          // Converter mg para ml: dose em mg / concentração (mg/ml) = volume em ml
          doseCalculada = doseMg / concentracaoMgMl;
          unidadeResultado = 'ml';
          
          // Calcular gotas (1ml = 20 gotas, então 0.05ml = 1 gota)
          quantidadeGotas = Math.round(doseCalculada / 0.05);
          
          explicacaoCalculo = `Dose calculada: ${pesoNum}kg × ${variacaoSelecionada.dosePorKg}mg/kg = ${doseMg}mg. ` +
                            `Volume: ${doseMg}mg ÷ ${concentracaoMgMl}mg/ml = ${Math.round(doseCalculada * 100) / 100}ml. ` +
                            `Gotas: ${Math.round(doseCalculada * 100) / 100}ml ÷ 0.05ml/gota = ${quantidadeGotas} gotas.`;
        }
      }
      
      setResultadoCalculo({
        dose: Math.round(doseCalculada * 100) / 100,
        unidade: unidadeResultado,
        gotas: quantidadeGotas,
        explicacao: explicacaoCalculo,
        observacoes: variacaoSelecionada.observacoes,
        medicamento: {
          nome: variacaoSelecionada.nome,
          apresentacao: variacaoSelecionada.apresentacao,
          concentracao: variacaoSelecionada.concentracao
        }
      });
    } finally {
      setLoadingCalculo(false);
    }
  };

  const voltarParaCategorias = () => {
    setCategoriaAtiva(null);
    setMedicamentos([]);
    setMedicamentosAgrupados([]);
    setMedicamentoBaseSelecionado(null);
    setVariacaoSelecionada(null);
    setPeso('');
    setResultadoCalculo(null);
    setError(null);
  };

  const voltarParaSecoes = () => {
    setSecaoAtiva(null);
    setCategorias([]);
    setCategoriaAtiva(null);
    setMedicamentos([]);
    setMedicamentosAgrupados([]);
    setMedicamentoBaseSelecionado(null);
    setVariacaoSelecionada(null);
    setPeso('');
    setResultadoCalculo(null);
    setError(null);
  };

  const voltarParaMedicamentos = () => {
    setMedicamentoBaseSelecionado(null);
    setVariacaoSelecionada(null);
    setPeso('');
    setResultadoCalculo(null);
    setError(null);
  };

  const voltarParaVariacoes = () => {
    setVariacaoSelecionada(null);
    setPeso('');
    setResultadoCalculo(null);
    setError(null);
  };

  // Tela principal - Seleção de seção
  if (!secaoAtiva) {
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
            <p className="text-gray-600">Selecione a faixa etária para ver os medicamentos disponíveis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => setSecaoAtiva('pediatrico')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Baby className="h-10 w-10 text-pink-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Medicamentos Pediátricos</h2>
                <p className="text-gray-600">Dosagens específicas para crianças e bebês</p>
                <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
                  Acessar <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </div>
            </div>

            <div
              onClick={() => setSecaoAtiva('adulto')}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Medicamentos para Adultos</h2>
                <p className="text-gray-600">Dosagens padrão para pacientes adultos</p>
                <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
                  Acessar <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Tela de categorias
  if (!categoriaAtiva) {
    return (
      <Layout title="Medicamentos">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={voltarParaSecoes}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <div className="flex items-center">
              {secaoAtiva === 'pediatrico' ? (
                <Baby className="h-6 w-6 text-pink-600 mr-2" />
              ) : (
                <User className="h-6 w-6 text-blue-600 mr-2" />
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {secaoAtiva === 'pediatrico' ? 'Medicamentos Pediátricos' : 'Medicamentos para Adultos'}
              </h1>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
              <button 
                onClick={carregarCategorias}
                className="ml-2 text-red-800 underline hover:no-underline"
              >
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
                      <p className="text-gray-600 text-sm">
                        {categoria.quantidade_medicamentos} medicamentos disponíveis
                      </p>
                      <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
                        Ver medicamentos <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Tela de seleção de variação do medicamento
  if (medicamentoBaseSelecionado && !variacaoSelecionada) {
    return (
      <Layout title="Medicamentos">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={voltarParaMedicamentos}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <div className="flex items-center">
              <Pill className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                {medicamentoBaseSelecionado.nomeBase} - Selecionar Variação
              </h1>
            </div>
          </div>

          {medicamentoBaseSelecionado.principio_ativo && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Princípio Ativo:</strong> {medicamentoBaseSelecionado.principio_ativo}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medicamentoBaseSelecionado.variacoes.map((variacao) => (
              <div
                key={variacao.id}
                onClick={() => setVariacaoSelecionada(variacao)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{variacao.apresentacao}</h3>
                    {variacao.concentracao && (
                      <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block mb-2">
                        {variacao.concentracao}
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Tablet className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Droplets className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{variacao.vias.join(', ')}</span>
                  </div>
                  {variacao.dosePorKg > 0 && (
                    <div className="flex items-center text-sm">
                      <Weight className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{variacao.dosePorKg} {variacao.unidade}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium text-sm">Selecionar esta variação</span>
                  <ArrowLeft className="h-4 w-4 text-blue-600 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Tela de cálculo de dosagem
  if (variacaoSelecionada) {
    return (
      <Layout title="Medicamentos">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={voltarParaVariacoes}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Cálculo de Dosagem</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Tablet className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">{variacaoSelecionada.nome}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Apresentação</p>
                <p className="font-medium">{variacaoSelecionada.apresentacao}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vias de administração</p>
                <p className="font-medium">{variacaoSelecionada.vias.join(', ')}</p>
              </div>
              {variacaoSelecionada.concentracao && (
                <div>
                  <p className="text-sm text-gray-600">Concentração</p>
                  <p className="font-medium">{variacaoSelecionada.concentracao}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Observações</p>
                <p className="font-medium text-sm">{variacaoSelecionada.observacoes}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <Weight className="h-5 w-5 text-blue-600 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Peso do Paciente (kg)
                </label>
              </div>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ex: 25"
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={calcularDose}
                  disabled={!peso || loadingCalculo}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingCalculo ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Calculator className="h-4 w-4 mr-2" />
                  )}
                  Calcular
                </button>
              </div>
            </div>

            {resultadoCalculo && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-blue-800">Resultado do Cálculo</h3>
                </div>
                
                {/* Resultado principal */}
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {resultadoCalculo.gotas ? (
                    <>
                      {resultadoCalculo.gotas} gotas
                      <span className="text-lg font-medium text-blue-700 ml-2">
                        ({resultadoCalculo.dose} {resultadoCalculo.unidade})
                      </span>
                    </>
                  ) : (
                    `${resultadoCalculo.dose} ${resultadoCalculo.unidade}`
                  )}
                </div>
                
                <p className="text-sm text-blue-700">
                  Para paciente de {peso}kg
                </p>
                
                {/* Explicação do cálculo */}
                {resultadoCalculo.explicacao && (
                  <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Como foi calculado:</h4>
                    <p className="text-sm text-blue-700">{resultadoCalculo.explicacao}</p>
                  </div>
                )}
                
                {/* Recomendação especial para Ibuprofeno */}
                {variacaoSelecionada?.nome.toLowerCase().includes('ibuprofeno') && 
                 secaoAtiva === 'pediatrico' && 
                 variacaoSelecionada.apresentacao.toLowerCase().includes('gotas') && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Recomendações Importantes:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Administrar a cada 6-8 horas (máximo 3-4x ao dia)</li>
                      <li>• Não exceder 40mg/kg/dia</li>
                      <li>• Dar preferencialmente após as refeições</li>
                      <li>• Manter hidratação adequada da criança</li>
                      <li>• Consultar pediatra se febre persistir por mais de 3 dias</li>
                    </ul>
                  </div>
                )}
                
                {resultadoCalculo.frequencia_dia && (
                  <p className="text-sm text-blue-700 mt-2">
                    Frequência: {resultadoCalculo.frequencia_dia}x ao dia
                  </p>
                )}
                
                {resultadoCalculo.observacoes && (
                  <p className="text-sm text-blue-700 mt-1">
                    {resultadoCalculo.observacoes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Tela de medicamentos agrupados
  const categoriaAtual = categorias.find(c => c.id === categoriaAtiva);
  
  return (
    <Layout title="Medicamentos">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={voltarParaCategorias}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </button>
          <div className="flex items-center">
            {categoriaAtual && (
              <>
                {React.createElement(getIconComponent(categoriaAtual.icone), { className: "h-6 w-6 text-gray-600 mr-2" })}
                <h1 className="text-2xl font-bold text-gray-900">{categoriaAtual.nome}</h1>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button 
              onClick={carregarMedicamentos}
              className="ml-2 text-red-800 underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loadingMedicamentos ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando medicamentos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicamentosAgrupados.map((grupo, index) => (
              <div
                key={index}
                onClick={() => setMedicamentoBaseSelecionado(grupo)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{grupo.nomeBase}</h3>
                    {grupo.principio_ativo && (
                      <p className="text-sm text-gray-600 mb-2">{grupo.principio_ativo}</p>
                    )}
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block">
                      {grupo.variacoes.length} variação{grupo.variacoes.length > 1 ? 'ões' : ''}
                    </div>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Pill className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-1 mb-4">
                  {grupo.variacoes.slice(0, 3).map((variacao, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      • {variacao.apresentacao}
                      {variacao.concentracao && ` - ${variacao.concentracao}`}
                    </div>
                  ))}
                  {grupo.variacoes.length > 3 && (
                    <div className="text-xs text-gray-400">
                      + {grupo.variacoes.length - 3} outras variações
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium text-sm">Ver variações</span>
                  <div className="flex items-center">
                    <ChevronDown className="h-4 w-4 text-blue-600 rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medications;