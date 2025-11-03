const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyAuth');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/yo', verifyToken, (req, res) => {
    res.json({ message: "Ruta protegida accedida", user: req.user });
});

module.exports = router;