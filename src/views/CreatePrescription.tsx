import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Printer, Save, Wand2 } from 'lucide-react';
import { getTreatmentSuggestion } from '../services/iaService';

const CreatePrescription: React.FC = () => {
  const { currentUser } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [iaSuggestion, setIaSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedPrescription, setSavedPrescription] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingIA, setIsLoadingIA] = useState(false);

  const handleAutoCompleteTreatment = async () => {
    if (!symptoms) {
      alert('Por favor, preencha os sintomas antes de gerar o tratamento!');
      return;
    }
    setIsLoadingIA(true);
    try {
      const suggestion = await getTreatmentSuggestion(symptoms);
      setIaSuggestion(suggestion);
    } catch (error) {
      console.error('Erro ao obter sugestão da IA:', error);
      alert('Erro ao obter sugestão da IA. Tente novamente.');
    } finally {
      setIsLoadingIA(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientAge || !symptoms || !treatment) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const date = new Date().toLocaleDateString('pt-BR');
      const prescriptionText = `
PRESCRIÇÃO MÉDICA

Data: ${date}

INFORMAÇÕES DO PACIENTE
Nome: ${patientName}
Idade: ${patientAge}

SINTOMAS
${symptoms}

TRATAMENTO / PRESCRIÇÃO
${treatment}

INFORMAÇÕES DO MÉDICO
Dr(a). ${currentUser?.name}
CRM: ${currentUser?.crm}
      `.trim();
      setSavedPrescription(prescriptionText);
      setShowSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescrição Médica</title>
          <style>
            @page { size: A4; margin: 2cm; }
            body { font-family: Arial; line-height: 1.6; margin: 0; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
            .footer { margin-top: 50px; text-align: center; border-top: 1px solid #000; padding-top: 20px; }
            .doctor-info { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PRESCRIÇÃO MÉDICA</h1>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          <div class="section">
            <div class="section-title">INFORMAÇÕES DO PACIENTE</div>
            <p>Nome: ${patientName}</p>
            <p>Idade: ${patientAge} anos</p>
          </div>
          <div class="section">
            <div class="section-title">SINTOMAS</div>
            <p>${symptoms}</p>
          </div>
          <div class="section">
            <div class="section-title">TRATAMENTO / PRESCRIÇÃO</div>
            <p>${treatment.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="footer">
            <div class="doctor-info">
              <p>____________________________________</p>
              <p>Dr(a). ${currentUser?.name}</p>
              <p>CRM: ${currentUser?.crm}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  const handleReset = () => {
    setPatientName('');
    setPatientAge('');
    setSymptoms('');
    setTreatment('');
    setIaSuggestion('');
    setSavedPrescription(null);
  };

  return (
    <Layout title="Criar Prescrição">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md z-50 flex items-center">
          <Save className="h-5 w-5 mr-2" />
          Prescrição salva com sucesso!
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Nova Prescrição</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                    Nome do Paciente
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
                    Idade do Paciente
                  </label>
                  <input
                    id="patientAge"
                    type="number"
                    min="0"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                  Sintomas
                </label>
                <textarea
                  id="symptoms"
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva os sintomas do paciente..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
                  Tratamento / Prescrição (Preenchimento Médico)
                </label>
                <textarea
                  id="treatment"
                  rows={5}
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite os medicamentos, dosagens e instruções..."
                ></textarea>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Prescrição
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Limpar Formulário
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-600" />
              Sugestão da IA
            </h2>
            <div className="border border-gray-300 rounded-md p-3 min-h-[150px] bg-gray-50 whitespace-pre-wrap text-sm">
              {isLoadingIA ? (
                <div className="w-6 h-6 border-t-2 border-b-2 border-purple-600 rounded-full animate-spin mx-auto"></div>
              ) : iaSuggestion ? (
                iaSuggestion
              ) : (
                <p className="text-gray-400">Clique no botão para gerar sugestão automática</p>
              )}
            </div>
            <button
              onClick={handleAutoCompleteTreatment}
              disabled={isLoadingIA}
              className="mt-3 w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
            >
              Gerar Sugestão IA
            </button>
          </div>

          <div className="flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800">Visualização da Prescrição</h2>
              {savedPrescription && (
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </button>
              )}
            </div>
            {!savedPrescription ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 h-full flex items-center justify-center text-gray-500">
                A visualização da prescrição aparecerá aqui após salvar
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 font-mono text-sm whitespace-pre-wrap overflow-auto flex-grow">
                {savedPrescription}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePrescription;