const jwtService = require("../../application/jwtService")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try{
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

module.exports = verifyToken;