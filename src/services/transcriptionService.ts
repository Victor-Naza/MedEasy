const API_BASE = 'http://localhost:5000/api/transcricao';
const TOKEN_KEY = 'medicalToken';

function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error('Usuário não autenticado.');
  return { Authorization: `Bearer ${token}` };
}

// ── Transcrição de áudio ─────────────────────────────────────

export interface TranscriptionChunkResult {
  text: string;
  engine: string;
}

export async function transcribeAudioChunk(
  audioBlob: Blob
): Promise<TranscriptionChunkResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'consulta.webm');

  const response = await fetch(`${API_BASE}/transcrever`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao transcrever o áudio.');
  return data as TranscriptionChunkResult;
}

// ── CRUD de transcrições salvas ──────────────────────────────

export interface TranscricaoSummary {
  id: string;
  titulo: string;
  pacienteNome: string | null;
  duracaoSegundos: number;
  createdAt: string;
}

export interface TranscricaoDetail extends TranscricaoSummary {
  conteudo: string;
}

export async function saveTranscricao(payload: {
  titulo: string;
  conteudo: string;
  pacienteNome?: string;
  duracaoSegundos?: number;
}): Promise<TranscricaoDetail> {
  const response = await fetch(`${API_BASE}/salvar`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao salvar transcrição.');
  return data as TranscricaoDetail;
}

export async function listTranscricoes(): Promise<TranscricaoSummary[]> {
  const response = await fetch(`${API_BASE}/listar`, {
    headers: authHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao listar transcrições.');
  return data as TranscricaoSummary[];
}

export async function getTranscricao(id: string): Promise<TranscricaoDetail> {
  const response = await fetch(`${API_BASE}/${id}`, {
    headers: authHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao buscar transcrição.');
  return data as TranscricaoDetail;
}

export async function deleteTranscricao(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Erro ao excluir transcrição.');
  }
}
