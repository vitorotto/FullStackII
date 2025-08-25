import users  from "../db/users.js";
import express from "express"

import validateUserDTO from "../middlewares/validateUserDTO.js";

const UserRouter = express.Router();

// Rota para criar usuário
UserRouter.post('/', validateUserDTO, (req, res) => {
    const data = req.body;

    try {
        users.push(data);
        res.status(201).json({ message: 'Usuário criado com sucesso' }, data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
})

// Rota para buscar usuário pelo ID
UserRouter.get('/:id', (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(200).json({ message: "Esse ID não foi encontrado" });
        return;
    }

    try {
        const data = users.find(id => id === id);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
})

// Rota para listar todos os usuários
UserRouter.get('/', (req, res) => {
    try {
        const data = users;
        res.status(200).json({ users: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Houve algum erro no servidor" });
    }
})

// Rota para atualizar os dados do usuário
UserRouter.put('/:id', validateUserDTO, (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    try {
        const data = users.find(id => id === id);
        /* const editedUser =  */
    } catch (error) {
        
    }
})

export default UserRouter;