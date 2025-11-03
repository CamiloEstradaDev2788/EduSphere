const jwt = require("jsonwebtoken");
const Perfil = require("../models/perfilModel");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado o inválido." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const perfil = await Perfil.findById(decoded.id);
    if (!perfil) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    req.user = perfil;
    next();
  } catch (error) {
    console.error("Error en verifyUser:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};
