export interface MedicationSuggestion {
  nome: string;
  posologia: string;
  justificativa: string;
  concentracao: string | null;
  apresentacao: string | null;
  via_administracao: string | null;
  categoria: string | null;
  cor: string | null;
  disponivel: boolean;
}

export interface IASuggestionResult {
  suggestion: string;
  medications: MedicationSuggestion[];
}

export async function getTreatmentSuggestion(
  symptoms: string,
  patientAge?: string
): Promise<IASuggestionResult> {
  const response = await fetch('http://localhost:5000/api/ai-suggestion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms, patientAge }),
  });
  const data = await response.json();
  return {
    suggestion: data.suggestion || '',
    medications: data.medications || [],
  };
}
