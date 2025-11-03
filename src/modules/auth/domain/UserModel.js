const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rolperfil: { type: String, enum: ["usuario", "admin"], default: "usuario" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);