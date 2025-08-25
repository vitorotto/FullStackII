import express from 'express';
import ProductRouter from './routes/productRoutes.js';
import UserRouter from './routes/userRoutes.js';
const port = 3000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "API rodando!" });
})

app.use('/products', ProductRouter)
app.use('/users', UserRouter)

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})