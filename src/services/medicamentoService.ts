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
  via_administracao: string;
  concentracao?: string;
  unidade_dose?: string;
  categoria?: string;
}

export const medicamentosService = {
  async getCategorias(): Promise<Categoria[]> {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async getMedicamentosPorCategoria(categoriaId: number): Promise<Medicamento[]> {
    const response = await fetch(`${API_BASE_URL}/categoria/${categoriaId}`);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async getMedicamentoDetalhes(medicamentoId: number): Promise<Medicamento> {
    const response = await fetch(`${API_BASE_URL}/${medicamentoId}`);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    return response.json();
  },

  async buscarMedicamentos(termo?: string): Promise<Medicamento[]> {
    const params = new URLSearchParams();
    if (termo) params.append('termo', termo);
    const response = await fetch(`${API_BASE_URL}/buscar?${params}`);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    return response.json();
  }
};
