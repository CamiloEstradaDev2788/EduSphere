const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyAuth');
const verifyRole = require('../middlewares/verifyRole');

//Rutas publicas para el ecceso sin autenticacion
router.post('/register', registerUser);
router.post('/login', loginUser);

//Ruta protegida que requiere autenticacion
router.get('/yo', verifyToken, (req, res) => {
    res.json({ message: "Ruta protegida accedida", user: req.user });
});

//Ruta protegida que requiere autenticacion y rol especifico de admin
router.get('/admin', verifyToken, verifyRole('admin'), (req, res) => {
    res.json({ message: "Ruta de admin accedida", user: req.user });
});

module.exports = router;