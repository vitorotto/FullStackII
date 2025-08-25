import express, { application } from 'express';

import routes from './routes/routes.js';

const server = express();
server.use(express.json());

const port = 3000;

server.use(routes);
server.use((req, res, next) => {
    res.status(404).json( 'Rota não encontrada' );
})

server.listen(port, () => {
    console.log(`servidor rodando em: http://localhost:${port}`);
})