const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Perfil = require("../models/perfilModel");

//registro

router.post("/signup", async (req, res) => {
  try {
    const { nombre, correo, password, rolperfil } = req.body;

    // Validar datos básicos
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya existe
    const existeUsuario = await Perfil.findOne({ correo });
    if (existeUsuario) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo perfil
    const nuevoPerfil = new Perfil({
      nombre,
      correo,
      password: hashedPassword,
      rolperfil: rolperfil || "usuario",
    });

    await nuevoPerfil.save();

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    // Crear token JWT_SECRET
    const token = jwt.sign(
      { id: nuevoPerfil._id, rolperfil: nuevoPerfil.rolperfil },
      process.env.JWT_SECRET,
      { expiresIn: "200h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: nuevoPerfil._id,
        nombre: nuevoPerfil.nombre,
        correo: nuevoPerfil.correo,
        rolperfil: nuevoPerfil.rolperfil,
      },
    });
  } catch (error) {
    console.error("Error en /signup:", error);
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Debes proporcionar correo y contraseña" });
    }

    // Buscar usuario
    const perfil = await Perfil.findOne({ correo });
    if (!perfil) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña
    const esValida = await bcrypt.compare(password, perfil.password);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT usando JWT_SECRET
    const token = jwt.sign(
      { id: perfil._id, rolperfil: perfil.rolperfil },
      process.env.JWT_SECRET,
      { expiresIn: "200h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: perfil._id,
        nombre: perfil.nombre,
        correo: perfil.correo,
        rolperfil: perfil.rolperfil,
      },
    });
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
});

module.exports = router;