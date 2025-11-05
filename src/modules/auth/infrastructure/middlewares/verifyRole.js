const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        try {
            if(!req.user){
                return res.status(401).json({ message: 'Usuario no autenticado' });
            } // Asumiendo que el rol del usuario está en req.user.role
            const userRole = req.user.rolperfil;
            if (userRole !== requiredRole) {
                return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error en la verificación del rol' , error: error.message });
        }
    };
};

module.exports = verifyRole;