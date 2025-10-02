import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import ProductRouter from './routes/productRoutes.js';
import UserRouter from './routes/userRoutes.js';

const port = 5432;

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Permite requisições do frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permite cookies e headers de autenticação
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "API rodando!" });
})

app.use('/products', ProductRouter)
app.use('/users', UserRouter)

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})