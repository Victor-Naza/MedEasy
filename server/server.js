const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./src/routes/authRoutes');
const medicamentoRoutes = require('./src/routes/medicamentoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const transcriptionRoutes = require('./src/routes/transcriptionRoutes');
const { sequelize } = require('./src/services/db');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'NAO ENCONTRADO');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'OK' : 'NAO ENCONTRADO');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'OK' : 'NAO ENCONTRADO (transcricao desativada)');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'OK' : 'NAO ENCONTRADO');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/medicamentos/admin', adminRoutes);
app.use('/api/transcricao', transcriptionRoutes);

// IA para sugestoes (Gemini primario, OpenAI fallback — via iaRoute)
let geminiSuggestionModel = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GOOGLE_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    geminiSuggestionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('IA Sugestoes (Gemini): configurada');
  } else {
    console.log('IA Sugestoes: GOOGLE_API_KEY ausente, usando OpenAI se disponivel');
  }
} catch (error) {
  console.log('Gemini nao configurado:', error.message);
}
const iaRoutes = require('./src/routes/iaRoute')(geminiSuggestionModel);
app.use('/api', iaRoutes);

require('./src/models/associations');

const PORT = process.env.PORT || 5001;

sequelize.sync().then(() => {
  console.log('Banco sincronizado');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('  POST /api/auth/login');
    console.log('  POST /api/auth/register');
    console.log('  GET  /api/auth/me');
    console.log('  POST /api/transcricao/transcrever');
    console.log('  POST /api/transcricao/salvar');
    console.log('  GET  /api/transcricao/listar');
  });
});
