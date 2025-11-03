const authService = require("../../application/authService")
const jwtService = require("../../application/jwtService")

const registerUser = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        const token = jwtService.generateToken({ id: user._id, rolperfil: user.rolperfil });
        res.status(201).json({message: "Usuario registrado exitosamente", token, user});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    console.log("jwtService:", jwtService);
};

const loginUser = async (req, res) => {
    try {
        const { correo, password } = req.body;
        if (!correo || !password) {
            return res.status(400).json({ message: "Faltan datos: correo y/o password" });
        }
        const user = await authService.loginUser({correo, password});
        const token = jwtService.generateToken({ id: user._id, rolperfil: user.rolperfil });
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo,
                rolperfil: user.rolperfil
            }
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};