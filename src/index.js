const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./modules/auth/infrastructure/routes/authRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


//Rutas
app.use('/api/auth', authRoutes);




//--------------------------Conexion BD---------------------------------------------------------------------/
const PORT = 3000;
const MONGODB_URI = process.env.MONGO_URI;
//Conexion con mongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Conectado a la base de datos MongoDB');
}).catch((error) => {
    console.error('Error al conectar a la base de datos MongoDB:', error);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});