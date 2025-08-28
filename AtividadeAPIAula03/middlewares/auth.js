import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) return res.status(401).json({ message: 'Erro no login, não autorizado' });

    const token = bearer.split(' ')[1];

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = verifiedToken.id;
        req.userRole = verifiedToken.role;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token inválido' });
    }
}

export default authMiddleware;