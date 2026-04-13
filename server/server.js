const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./src/routes/authRoutes');
const medicamentoRoutes = require('./src/routes/medicamentoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { sequelize } = require('./src/services/db');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definido' : '❌ Não encontrado');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Definido' : '❌ Não encontrado');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/medicamentos/admin', adminRoutes);

// Configuração da IA (Gemini)
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GOOGLE_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const iaRoutes = require('./src/routes/iaRoute')(model);
    app.use('/api', iaRoutes);
    console.log('✅ IA (Gemini) configurada');
  }
} catch (error) {
  console.log('⚠️ IA não configurada:', error.message);
}

require('./src/models/associations');

const PORT = process.env.PORT || 5001;

sequelize.sync().then(() => {
  console.log('✅ Banco sincronizado');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/auth/register`);
    console.log(`   GET  /api/auth/me`);
  });
});
