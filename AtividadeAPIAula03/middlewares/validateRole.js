const validateUserRole = (req, res, next) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const method = req.method;
    const path = req.path;

    // Permitir apenas GET em produtos para todos
    if (path.startsWith('/products') && method === 'GET') {
        return next();
    }

    // Permitir edição/exclusão apenas se for o próprio usuário
    if ((method === 'PUT' || method === 'DELETE') && path.startsWith('/users/')) {
        const paramId = req.params.id;
        if (userId && paramId && userId === paramId) {
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