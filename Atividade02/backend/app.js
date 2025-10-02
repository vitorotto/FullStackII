import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import ProductRouter from './routes/productRoutes.js';
import UserRouter from './routes/userRoutes.js';

const port = 5432;

const app = express();

// Configuração do CORS mais permissiva para desenvolvimento
app.use(cors({
  origin: true, // Permite qualquer origem em desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Para suporte a navegadores legados
}));

// Middleware para debug das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'N/A'}`);
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "API rodando!" });
})

app.use('/products', ProductRouter)
app.use('/users', UserRouter)

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})