import users  from "../db/users.js";
import express from "express"

import validateUserDTO from "../middlewares/validateUserDTO.js";

const UserRouter = express.Router();

const findByEmail = (email) => {
    return users.find(user => user.email === email);
}



// Rota para criar usuário
UserRouter.post('/', validateUserDTO, (req, res) => {
    const id = users.length + 1;

    let data = {...req.body};
    data = {id,...data}

    try {
        
        users.push(data);
        res.status(201).json({ message: 'Usuário criado com sucesso' }, data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
})

// Rota de login
UserRouter.post('/login', (req, res) => {
    const { email, password } = req.body
    console.log(password)
    const user = findByEmail(email);
    if (!user) res.status(401).json({ message: "Email inválido" });
    if (password != user.password) {
        res.status(401).json({ message: "Senha inválida" });
    }
    res.status(200).json({ message: "Login realizado", user: user });
})

// Rota para buscar usuário pelo ID
UserRouter.get('/:id', (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(200).json({ message: "Esse ID não foi encontrado" });
        return;
    }

    try {
        const data = users.find(user => user.id === id);
        res.status(200).json({ user: data });
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
    if (!id) res.status(404).json({ message: "Id não encontrado" });
    const newData = req.body;
    try {
        let user = users.find(user => user.id === id);
        user = {...user, ...newData};
        const index = users.findIndex(i => i.id === id);
        users[index] = user;
        res.status(200).json({ message: "Usuário editado com sucesso", user: users[index] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Deu PT... É 13" });
    }
})

export default UserRouter;