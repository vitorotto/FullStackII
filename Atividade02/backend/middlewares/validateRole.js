const validateUserRole = (req, res, next) => {
    const userId = req.userId;
    const userRole = req.userRole;
    console.log(userRole)
    const method = req.method;
    // console.log(method)
    const path = req.path;
    // console.log(path)

    // Permitir apenas GET em produtos para todos
    if (path.startsWith('/') && method === 'GET') {
        return next();
    }

    // Permitir edição/exclusão apenas se for o próprio usuário
    if ((method === 'PUT' || method === 'DELETE') && path.startsWith(`/`)) {
        const paramId = req.params.id;
        if (userId == paramId || userRole === 'admin') {
            return next();
        }
        return res.status(403).json({ error: 'Ação não permitida para este usuário.' });
    }

    // Bloquear outras ações para usuários não administradores
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito.' });
    }

    next();
}

export default validateUserRole;