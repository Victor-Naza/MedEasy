import { AuthController } from '../controllers/AuthController';

export interface PrescricaoPayload {
  patient_name: string;
  patient_age: string;
  symptoms: string;
  treatment: string;
  ia_suggestion?: string;
}

export async function savePrescricao(payload: PrescricaoPayload): Promise<void> {
  const token = AuthController.getToken();
  const response = await fetch('http://localhost:5000/api/prescricoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Erro ao salvar prescrição.');
  }
}
