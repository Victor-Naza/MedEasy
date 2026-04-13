const API_BASE = 'http://localhost:5000/api/transcription';
const TOKEN_KEY = 'medicalToken';

function getAuthHeaders(): Record<string, string> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error('User not authenticated.');
  return { Authorization: `Bearer ${token}` };
}

// Audio transcription

export interface TranscriptionChunkResult {
  text: string;
  engine: string;
}

export async function transcribeAudioChunk(
  audioBlob: Blob
): Promise<TranscriptionChunkResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'consultation.webm');

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to transcribe audio.');
  return data as TranscriptionChunkResult;
}

// Saved transcriptions CRUD

export interface TranscriptionSummary {
  id: string;
  title: string;
  patientName: string | null;
  durationSeconds: number;
  createdAt: string;
}

export interface TranscriptionDetail extends TranscriptionSummary {
  content: string;
}

export async function saveTranscription(payload: {
  title: string;
  content: string;
  patientName?: string;
  durationSeconds?: number;
}): Promise<TranscriptionDetail> {
  const response = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save transcription.');
  return data as TranscriptionDetail;
}

export async function fetchTranscriptions(): Promise<TranscriptionSummary[]> {
  const response = await fetch(`${API_BASE}/list`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch transcriptions.');
  return data as TranscriptionSummary[];
}

export async function fetchTranscriptionById(id: string): Promise<TranscriptionDetail> {
  const response = await fetch(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch transcription.');
  return data as TranscriptionDetail;
}

export async function deleteTranscription(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete transcription.');
  }
}
