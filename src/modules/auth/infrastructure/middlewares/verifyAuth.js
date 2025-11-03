const { verifyToken } = require("../../application/jwtService")

const verifyTokens = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

module.exports = verifyTokens;