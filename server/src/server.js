const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const { sequelize } = require('./services/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de medicamentos
app.use('/api/medicamentos', medicamentoRoutes);

// Rotas de administração
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/medicamentos/admin', adminRoutes);

// Configuração da IA
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  if (process.env.GOOGLE_API_KEY) {
    console.log('🔍 Configurando IA...');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const iaRoutes = require('./routes/iaRoute')(model);
    app.use('/api', iaRoutes);
    
    console.log('✅ IA configurada com sucesso');
  } else {
    console.log('⚠️ GOOGLE_API_KEY não encontrada - IA desabilitada');
  }
} catch (error) {
  console.log('⚠️ Erro ao configurar IA:', error.message);
  console.log('💡 Certifique-se de instalar: npm install @google/generative-ai');
}

// Importar associações dos models
require('./models/associations');

// Teste de conexão com banco
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com banco OK'))
  .catch(err => console.error('❌ Erro na conexão:', err));

// Debug das variáveis de ambiente
console.log('🔍 Testando variáveis de ambiente:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definido' : '❌ Não encontrado');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Definido' : '❌ Não encontrado');

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Endpoints disponíveis:`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   - POST http://localhost:${PORT}/api/ia-suggestion`);
    console.log(`   - GET  http://localhost:${PORT}/api/medicamentos/categorias/:faixaEtaria`);
    console.log(`   - GET  http://localhost:${PORT}/api/medicamentos/categoria/:categoriaId/:faixaEtaria`);
    console.log(`   - POST http://localhost:${PORT}/api/medicamentos/calcular-dosagem`);
  });
});