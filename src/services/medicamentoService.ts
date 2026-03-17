const API_BASE_URL = 'http://localhost:5000/api/medicamentos';

export interface Categoria {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  quantidade_medicamentos: number;
}

export interface Medicamento {
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

export interface CalculoDosagem {
  dose: number;
  unidade: string;
  frequencia_dia?: number;
  dose_maxima_dia?: number;
  observacoes?: string;
  medicamento: {
    nome: string;
    apresentacao: string;
    concentracao?: string;
  };
}

export const medicamentosService = {
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

  // Buscar detalhes de um medicamento
  async getMedicamentoDetalhes(medicamentoId: number, faixaEtaria: 'pediatrico' | 'adulto'): Promise<Medicamento> {
    try {
      console.log('🔍 Buscando detalhes do medicamento:', medicamentoId);
      
      const response = await fetch(`${API_BASE_URL}/${medicamentoId}/${faixaEtaria}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const medicamento = await response.json();
      console.log('✅ Detalhes do medicamento:', medicamento);
      
      return medicamento;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do medicamento:', error);
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
      
      return resultado;
    } catch (error) {
      console.error('❌ Erro ao calcular dosagem:', error);
      throw new Error('Erro ao calcular dosagem');
    }
  },

  // Buscar medicamentos (busca geral)
  async buscarMedicamentos(termo?: string, faixaEtaria?: 'pediatrico' | 'adulto'): Promise<Medicamento[]> {
    try {
      console.log('🔍 Busca geral:', { termo, faixaEtaria });
      
      const params = new URLSearchParams();
      if (termo) params.append('termo', termo);
      if (faixaEtaria) params.append('faixaEtaria', faixaEtaria);
      
      const response = await fetch(`${API_BASE_URL}/buscar?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const medicamentos = await response.json();
      console.log('✅ Resultados da busca:', medicamentos);
      
      return medicamentos;
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      throw new Error('Erro ao buscar medicamentos');
    }
  }
};