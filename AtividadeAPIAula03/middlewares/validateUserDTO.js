const validateUserDTO = (req, res, next) => {
    const dtoFields = ["name", "email", "password"];
    console.log(dtoFields);
    const bodyFields = Object.keys(req.body);

    // Verificar se todos os campos do DTO estão presentes
    const missingFileds = dtoFields.filter(field => !bodyFields.includes(field));
    if (missingFileds.length > 0) {
        return res.status(400).json({ error: `Campos faltando: ${missingFileds.join(', ')}` });
    }

    // Verificar se há campos extras
    const extraFields = bodyFields.filter(field => !dtoFields.includes(field));
    if (extraFields.length > 0) {
        return res.status(400).json({ error: `Campos extras: ${extraFields.join(', ')}` })
    }

    next();
}

export default validateUserDTO;