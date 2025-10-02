import express from "express";
import jwt from "jsonwebtoken";

import users from "../db/users.js";
import authMiddleware from "../middlewares/auth.js";
import validateUserRole from "../middlewares/validateRole.js";
import validateUserDTO from "../middlewares/validateUserDTO.js";

const UserRouter = express.Router();

class UserService {
    findByEmail(email) {
        return users.find(user => user.email === email);
    }

    findById(id) {
        return users.find(user => user.id === id);
    }

    delete(id) {
        const index = users.findIndex(user => user.id === id);
        users.splice(index, 1);
    };
}

const userService = new UserService;

// Rota de login
UserRouter.post('/login', (req, res) => {
    const { email, password } = req.body
    const user = userService.findByEmail(email);
    if (!user) res.status(401).json({ message: "Email inválido" });
    if (password != user.password) {
        res.status(401).json({ message: "Senha inválida" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login realizado", user: user, token: token });
});

// Rota para criar usuário
UserRouter.post('/', validateUserDTO, (req, res) => {
    const data = { ...req.body };

    // Verificando se o usuário já existe
    const existingUser = userService.findByEmail(data.email)
    if (existingUser) res.status(400).json({ message: "Email já cadastrado!" });

    const id = users.length + 1;
    const user = {...data, role: 'user', id: id.toString()};

    try {
        users.push(user);
        res.status(201).json({ message: 'Usuário criado com sucesso', user: user     });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
})

UserRouter.use(authMiddleware);

// Rota para buscar usuário pelo ID
UserRouter.get('/:id', (req, res) => {
    const id = req.params.id
    if (!id) res.status(200).json({ message: "Id não encontrado" });

    try {
        const user = userService.findById(id);
        if (!user) res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json({ user: user });
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
UserRouter.put('/:id', validateUserRole, (req, res) => {
    const id = req.params.id;
    if (!id) res.status(404).json({ message: "Id não encontrado" });
    const newData = req.body;
    try {
        let user = userService.findById(id);
        if(!user) res.status(404).json({ message: "Usuário não encontrado" });
        user = { ...user, ...newData };
        const index = users.findIndex(i => i.id === id);
        users[index] = user;
        res.status(200).json({ message: "Usuário editado com sucesso", user: users[index] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Deu PT... É 13" });
    }
})

// Rota para deletar usuário
UserRouter.delete('/:id', validateUserRole, (req, res) => {
    const id = req.params.id;

    try {
        const user = userService.findById(id);
        if (!user) res.status(404).json({ message: "Usuário não encontrado" });
        userService.delete(id);
        res.status(200).json({ message: "Usuário deletado com sucesso", name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" })
    }
})

export default UserRouter;