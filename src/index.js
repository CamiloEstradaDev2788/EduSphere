const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log("🔑 JWT_SECRET cargado:", process.env.JWT_SECRET);
console.log("🔑 API Key detectada:", process.env.OPENAI_API_KEY ? "Sí" : "No");
console.log("MONGO_URI:", process.env.MONGO_URI);
const postRoutes = require("./routes/PostRoutes");

const parser = require("body-parser");
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const perfilRoutes = require("./routes/PerfilRoutes"); // Importa rutas
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authroutes");
const chatRoutes = require("./routes/ChatRoutes");
const authMiddleware = require("./middlewares/auth");


// Permite leer datos enviados desde formularios o JSON
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(express.json());

app.use("/api/auth", authRoutes); //login / signup

// Gestión de las rutas usando el middleware
app.use("/api", perfilRoutes);
app.use("/api", adminRoutes);

// Ruta para el chat de IA
app.use("/api/chat", chatRoutes); 

// Rutas de publicaciones
app.use("/api/posts", postRoutes);

// Verificar conexión a MongoDB
console.log("MONGO_URI:", process.env.MONGO_URI);

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Conexión exitosa a MongoDB"))
  .catch((error) => console.log(" Error en la conexión:", error));

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send(" API de Perfiles Académicos funcionando correctamente");
});

// Conexión al puerto
app.listen(port, () => {
  console.log(` Servidor corriendo en http://localhost:${port}`);
});
