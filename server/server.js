const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./src/routes/authRoutes');
const medicamentoRoutes = require('./src/routes/medicamentoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const transcriptionRoutes = require('./src/routes/transcriptionRoutes');
const prescricaoRoutes = require('./src/routes/prescricaoRoutes');
const { sequelize } = require('./src/services/db');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'NOT FOUND');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'OK' : 'NOT FOUND');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'OK' : 'NOT FOUND (transcription disabled)');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'OK' : 'NOT FOUND');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/medicamentos/admin', adminRoutes);
app.use('/api/transcription', transcriptionRoutes);
app.use('/api/prescricoes', prescricaoRoutes);

// AI suggestions: Gemini (primary), OpenAI (fallback)
let geminiSuggestionModel = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GOOGLE_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    geminiSuggestionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('AI suggestions (Gemini): configured');
  } else {
    console.log('AI suggestions: GOOGLE_API_KEY not set, falling back to OpenAI if available');
  }
} catch (error) {
  console.log('Gemini not configured:', error.message);
}
const aiRoutes = require('./src/routes/aiRoute')(geminiSuggestionModel);
app.use('/api', aiRoutes);

require('./src/models/associations');

const PORT = process.env.PORT || 5001;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('  POST /api/auth/login');
    console.log('  POST /api/auth/register');
    console.log('  GET  /api/auth/me');
    console.log('  POST /api/transcription/transcribe');
    console.log('  POST /api/transcription/save');
    console.log('  GET  /api/transcription/list');
    console.log('  POST /api/ai-suggestion');
  });
});
