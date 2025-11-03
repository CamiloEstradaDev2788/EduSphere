class AuthEntity {
    constructor({ id, nombre, correo, password, rolperfil }) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.rolperfil = rolperfil;
    }
}

module.exports = AuthEntity;