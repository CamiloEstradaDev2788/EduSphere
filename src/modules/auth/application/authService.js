const bcrypt = require('bcryptjs');
const User = require('../domain/UserModel');

class AuthService {
    async registerUser({ nombre, correo, password, rolperfil }) {
        // Validar datos básicos
        if (!nombre || !correo || !password) {
            throw new Error("Todos los campos son obligatorios");
        }
        const existe = await User.findOne({ correo });
        if (existe)throw new Error("El correo ya está registrado");

        const hashed = await bcrypt.hash(password, 10);
        const nuevo = new User({
            nombre,
            correo,
            password: hashed,
            rolperfil,
        });
        await nuevo.save();
        return nuevo;
    }

    async loginUser({ correo, password }) {
        const user = await User.findOne({ correo });
        if (!user) throw new Error("Usuario no encontrado");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Contraseña incorrecta");

        return user;

    }
}

module.exports = new AuthService();