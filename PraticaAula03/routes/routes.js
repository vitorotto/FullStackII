import express from 'express';

import tarefas from '../data/data.js';
import data from '../data/data.js';

const router = express.Router();

// Main da API
router.get('/', (req, res) => {
    res.status(200).json( 'main site' );
});

// Pegar todos as tarefas
router.get('/tarefas', (req, res) => {
    try {
        res.status(200).json( tarefas );
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro interno no servidor');
    }
})

// pegar tarefa por id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id)
        res.status(404).json( 'Tarefa não encontrada' );
    
    try {
        const tarefa = tarefas.find(t => t.id === id);
        res.status(200).json( tarefa );
    } catch (error) {
        console.error(error);
        res.status(500).json( 'Erro interno no servidor' );
    }
})

// adicionar projeto
router.post('/add', (req, res) => {
    const newTarefa = req.body;
    try {
        data.push(newTarefa);
        res.status(201).json({ message: 'Tarefa criada com sucesso' }, newTarefa);
    } catch (error) {
        console.error(error);
        res.status(500).json('Deu erro!');
    }
})

// editar projeto
router.put('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(200).json('Id não encontrado');
        return;
    } else {
        try {
            const tarefa = tarefas.find(t => t.id === id);
            
            tarefa.nome = req.body.nome ?? tarefa.nome;

            res.status(201).json({ message: 'Tarefa editada', tarefa });
            
        } catch (error) {
            console.error(error);
            res.status(500.).json('Deu erro na edição');
        }
    }
})

export default router;