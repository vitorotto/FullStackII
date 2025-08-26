import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const bearer = req.headers.authorization;
    


}