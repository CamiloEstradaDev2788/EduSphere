const jwt = require('jsonwebtoken');

// Usa el mismo secreto que tu auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'miSecretoSuperSeguro';

function authTest(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  try {
    // Verifica el token sin chequear la base de datos
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // puedes usar req.user en tu route si quieres
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authTest;
