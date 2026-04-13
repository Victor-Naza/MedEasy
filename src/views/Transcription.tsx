import React, { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import {
  transcribeAudioChunk,
  saveTranscricao,
  listTranscricoes,
  getTranscricao,
  deleteTranscricao,
  TranscricaoSummary,
} from '../services/transcriptionService';
import {
  Mic,
  MicOff,
  Monitor,
  Square,
  Copy,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
  Volume2,
  Info,
  Save,
  History,
  ChevronRight,
  X,
  Clock,
  User,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
interface TranscriptionBlock {
  index: number;
  text: string;
  timestampStart: number;
  status: 'transcribing' | 'done' | 'error';
  error?: string;
}

type RecordingStatus = 'idle' | 'recording' | 'stopping';
type ActiveTab = 'record' | 'history';
type CaptureMode = 'meet' | 'mic';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `[${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}]`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getSupportedMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}

const MAX_CHUNK_BYTES = 24 * 1024 * 1024; // 24 MB
const CHUNK_INTERVAL_MS = 60_000; // 60 s

// ─────────────────────────────────────────────────────────────
// Modal de salvar
// ─────────────────────────────────────────────────────────────
interface SaveDialogProps {
  fullText: string;
  durationSeconds: number;
  onSave: (titulo: string, pacienteNome: string) => Promise<void>;
  onClose: () => void;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  fullText,
  durationSeconds,
  onSave,
  onClose,
}) => {
  const [titulo, setTitulo] = useState('');
  const [pacienteNome, setPacienteNome] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(titulo, pacienteNome);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Salvar transcrição</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da consulta
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Consulta de rotina — Dr. Silva"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do paciente (opcional)
            </label>
            <input
              type="text"
              value={pacienteNome}
              onChange={(e) => setPacienteNome(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <p className="text-xs text-gray-500">
            Duração: {formatTime(durationSeconds)} · {fullText.split(' ').filter(Boolean).length} palavras
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Aba Histórico
// ─────────────────────────────────────────────────────────────
const HistoryTab: React.FC = () => {
  const [transcricoes, setTranscricoes] = useState<TranscricaoSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTranscricoes();
      setTranscricoes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleSelect = async (id: string) => {
    if (selected === id) {
      setSelected(null);
      setSelectedContent('');
      return;
    }
    setSelected(id);
    setLoadingContent(true);
    try {
      const detail = await getTranscricao(id);
      setSelectedContent(detail.conteudo);
    } catch {
      setSelectedContent('Erro ao carregar conteúdo.');
    } finally {
      setLoadingContent(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta transcrição?')) return;
    try {
      await deleteTranscricao(id);
      setTranscricoes((prev) => prev.filter((t) => t.id !== id));
      if (selected === id) {
        setSelected(null);
        setSelectedContent('');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  const handleCopy = async () => {
    if (!selectedContent) return;
    await navigator.clipboard.writeText(selectedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!selectedContent) return;
    const t = transcricoes.find((x) => x.id === selected);
    const blob = new Blob([selectedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t?.titulo ?? 'transcricao'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-blue-500 gap-2">
        <Loader className="w-5 h-5 animate-spin" />
        <span className="text-sm">Carregando histórico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-50 text-red-700 rounded-xl p-4 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        {error}
      </div>
    );
  }

  if (transcricoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
        <History className="w-10 h-10" />
        <p className="text-sm">Nenhuma transcrição salva ainda.</p>
      </div>
    );
  }

  const selectedItem = transcricoes.find((t) => t.id === selected);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Lista */}
      <div className="space-y-2">
        {transcricoes.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-xl border cursor-pointer transition-colors ${
              selected === t.id ? 'border-blue-400 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="flex items-start justify-between p-4"
              onClick={() => handleSelect(t.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{t.titulo}</p>
                {t.pacienteNome && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3" />
                    {t.pacienteNome}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(t.duracaoSegundos)}
                  </span>
                  <span>{formatDate(t.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    selected === t.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conteúdo selecionado */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full min-h-48 text-gray-400 gap-2 p-6">
            <Volume2 className="w-8 h-8" />
            <p className="text-sm text-center">Selecione uma transcrição para visualizar.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-700 truncate">
                {selectedItem?.titulo}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="Copiar"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleExport}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="Exportar TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {loadingContent ? (
                <div className="flex items-center gap-2 text-blue-500">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Carregando...</span>
                </div>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedContent}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────
const Transcription: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('record');
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [captureMode, setCaptureMode] = useState<CaptureMode>('meet');
  const [blocks, setBlocks] = useState<TranscriptionBlock[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkIndexRef = useRef(0);
  const recordingStartRef = useRef(0);
  const chunkStartRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunkRotationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptionEndRef = useRef<HTMLDivElement | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    transcriptionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blocks]);

  // ── Chunk helpers ──────────────────────────────────────────

  const sendChunk = useCallback(async (blob: Blob, index: number, chunkStart: number) => {
    if (blob.size === 0) return;

    setBlocks((prev) => [
      ...prev,
      { index, text: '', timestampStart: chunkStart, status: 'transcribing' },
    ]);

    try {
      const result = await transcribeAudioChunk(blob);
      setBlocks((prev) =>
        prev.map((b) =>
          b.index === index ? { ...b, text: result.text.trim(), status: 'done' } : b
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setBlocks((prev) =>
        prev.map((b) => (b.index === index ? { ...b, status: 'error', error: msg } : b))
      );
    }
  }, []);

  const rotateChunk = useCallback(() => {
    const currentChunks = [...chunksRef.current];
    const currentIndex = chunkIndexRef.current;
    const currentChunkStart = Math.floor(
      (chunkStartRef.current - recordingStartRef.current) / 1000
    );

    chunksRef.current = [];
    chunkIndexRef.current += 1;
    chunkStartRef.current = Date.now();

    if (currentChunks.length > 0) {
      const mimeType = getSupportedMimeType();
      const blob = new Blob(currentChunks, { type: mimeType });
      sendChunk(blob, currentIndex, currentChunkStart);
    }
  }, [sendChunk]);

  // ── Iniciar gravação ───────────────────────────────────────

  const startRecording = async () => {
    setError('');
    try {
      let stream: MediaStream;

      if (captureMode === 'meet') {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            sampleRate: 44100,
          },
          video: true,
        });

        displayStream.getVideoTracks().forEach((t) => t.stop());

        if (displayStream.getAudioTracks().length === 0) {
          displayStream.getTracks().forEach((t) => t.stop());
          setError(
            'Nenhuma fonte de áudio foi capturada. Selecione a aba do Google Meet e marque "Compartilhar áudio da aba".'
          );
          return;
        }

        stream = displayStream;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      streamRef.current = stream;
      chunksRef.current = [];
      chunkIndexRef.current = 0;
      chunkStartRef.current = Date.now();
      recordingStartRef.current = Date.now();
      isRecordingRef.current = true;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          const totalSize = chunksRef.current.reduce((acc, b) => acc + b.size, 0);
          if (totalSize >= MAX_CHUNK_BYTES) rotateChunk();
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;

      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - recordingStartRef.current) / 1000));
      }, 1000);

      chunkRotationRef.current = setInterval(rotateChunk, CHUNK_INTERVAL_MS);

      stream.getTracks().forEach((track) => {
        track.onended = () => {
          if (isRecordingRef.current) stopRecording();
        };
      });

      setStatus('recording');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Permissão negada. Você precisa permitir o compartilhamento de tela/áudio.');
      } else if (err instanceof Error && err.name === 'NotFoundError') {
        setError('Dispositivo de áudio não encontrado.');
      } else {
        setError(err instanceof Error ? err.message : 'Erro ao iniciar gravação.');
      }
    }
  };

  // ── Parar gravação ─────────────────────────────────────────

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    setStatus('stopping');

    if (timerRef.current) clearInterval(timerRef.current);
    if (chunkRotationRef.current) clearInterval(chunkRotationRef.current);

    const finalChunks = [...chunksRef.current];
    const finalIndex = chunkIndexRef.current;
    const finalStart = Math.floor(
      (chunkStartRef.current - recordingStartRef.current) / 1000
    );
    chunksRef.current = [];

    if (finalChunks.length > 0) {
      const mimeType = getSupportedMimeType();
      const blob = new Blob(finalChunks, { type: mimeType });
      sendChunk(blob, finalIndex, finalStart);
    }

    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStatus('idle');
  }, [sendChunk]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (chunkRotationRef.current) clearInterval(chunkRotationRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Ações ──────────────────────────────────────────────────

  const fullText = blocks
    .filter((b) => b.status === 'done')
    .map((b) => `${formatTimestamp(b.timestampStart)} ${b.text}`)
    .join('\n\n');

  const copyToClipboard = async () => {
    if (!fullText) return;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportTxt = () => {
    if (!fullText) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consulta-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearTranscription = () => {
    setBlocks([]);
    setRecordingTime(0);
    setError('');
    setSavedSuccess(false);
  };

  const handleSave = async (titulo: string, pacienteNome: string) => {
    await saveTranscricao({
      titulo,
      conteudo: fullText,
      pacienteNome: pacienteNome || undefined,
      duracaoSegundos: recordingTime,
    });
    setSavedSuccess(true);
  };

  const isRecording = status === 'recording';
  const hasContent = blocks.some((b) => b.status === 'done');
  const isTranscribingAny = blocks.some((b) => b.status === 'transcribing');

  // ── Render ─────────────────────────────────────────────────

  return (
    <Layout title="Transcrição de Consultas">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'record'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            Nova Consulta
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <History className="w-4 h-4" />
            Histórico
          </button>
        </div>

        {/* ── Aba: Nova Consulta ────────────────────────────── */}
        {activeTab === 'record' && (
          <>
            {/* Instrução Google Meet */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 space-y-1">
                <p className="font-semibold">Como usar com Google Meet:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
                  <li>Abra a consulta no Google Meet em outra aba do Chrome.</li>
                  <li>Clique em <strong>"Capturar Google Meet"</strong> abaixo.</li>
                  <li>Na janela que abrir, selecione a <strong>aba do Google Meet</strong>.</li>
                  <li>
                    Marque <strong>"Compartilhar áudio da aba"</strong> (canto inferior esquerdo).
                  </li>
                  <li>Clique em <strong>Compartilhar</strong> — a gravação inicia.</li>
                </ol>
              </div>
            </div>

            {/* Modo de captura */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Fonte de áudio</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => !isRecording && setCaptureMode('meet')}
                  disabled={isRecording}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    captureMode === 'meet'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Monitor className="w-4 h-4" />
                  Capturar Google Meet
                </button>
                <button
                  onClick={() => !isRecording && setCaptureMode('mic')}
                  disabled={isRecording}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    captureMode === 'mic'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Mic className="w-4 h-4" />
                  Microfone local
                </button>
              </div>
              {captureMode === 'mic' && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                  Microfone local captura apenas a sua voz. Para consultas online, prefira "Capturar Google Meet".
                </p>
              )}
            </div>

            {/* Controles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Mic className="w-5 h-5" />
                      Iniciar Gravação
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <Square className="w-5 h-5" />
                      Parar Gravação
                    </button>
                  )}

                  {isRecording && (
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      </span>
                      <span className="font-mono text-lg font-semibold text-gray-800">
                        {formatTime(recordingTime)}
                      </span>
                      <span className="text-sm text-gray-500">gravando</span>
                    </div>
                  )}
                </div>

                {isTranscribingAny && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader className="w-4 h-4 animate-spin" />
                    Transcrevendo...
                  </div>
                )}
              </div>

              {/* Status dos chunks */}
              {blocks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {blocks.map((b) => (
                    <span
                      key={b.index}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        b.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {b.status === 'done' && <CheckCircle className="w-3 h-3" />}
                      {b.status === 'error' && <AlertCircle className="w-3 h-3" />}
                      {b.status === 'transcribing' && <Loader className="w-3 h-3 animate-spin" />}
                      {formatTimestamp(b.timestampStart)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Sucesso ao salvar */}
            {savedSuccess && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p>Transcrição salva com sucesso! Acesse o <strong>Histórico</strong> para visualizar.</p>
              </div>
            )}

            {/* Transcrição */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-gray-500" />
                  <h2 className="font-semibold text-gray-800">Transcrição</h2>
                  {isTranscribingAny && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      ao vivo
                    </span>
                  )}
                </div>
                {hasContent && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowSaveDialog(true)}
                      disabled={isRecording}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                    <button
                      onClick={exportTxt}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                    <button
                      onClick={clearTranscription}
                      disabled={isRecording}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 min-h-64 max-h-[30rem] overflow-y-auto">
                {!hasContent && !isRecording && (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
                    <MicOff className="w-10 h-10" />
                    <p className="text-sm">A transcrição aparecerá aqui durante a consulta.</p>
                  </div>
                )}

                {!hasContent && isRecording && (
                  <div className="flex flex-col items-center justify-center h-48 text-blue-400 gap-3">
                    <div className="flex gap-1 items-end">
                      {[12, 20, 16, 24, 14, 22, 18].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-blue-400 rounded-full animate-bounce"
                          style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-sm">Ouvindo... A transcrição chegará em instantes.</p>
                  </div>
                )}

                {blocks.length > 0 && (
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div key={block.index} className="flex gap-3">
                        <span className="font-mono text-xs text-gray-400 mt-1 flex-shrink-0 w-14">
                          {formatTimestamp(block.timestampStart)}
                        </span>
                        <div className="flex-1">
                          {block.status === 'transcribing' && (
                            <div className="flex items-center gap-2 text-sm text-blue-500">
                              <Loader className="w-3 h-3 animate-spin" />
                              Transcrevendo trecho...
                            </div>
                          )}
                          {block.status === 'done' && (
                            <p className="text-gray-800 text-sm leading-relaxed">{block.text}</p>
                          )}
                          {block.status === 'error' && (
                            <p className="text-red-500 text-sm">
                              Erro neste trecho: {block.error}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={transcriptionEndRef} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Aba: Histórico ────────────────────────────────── */}
        {activeTab === 'history' && <HistoryTab />}

        {/* Modal de salvar */}
        {showSaveDialog && (
          <SaveDialog
            fullText={fullText}
            durationSeconds={recordingTime}
            onSave={handleSave}
            onClose={() => setShowSaveDialog(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Transcription;
