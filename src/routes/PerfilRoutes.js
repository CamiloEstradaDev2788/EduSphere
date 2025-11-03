const express = require("express");
const router = express.Router();
const perfilSchema = require("../models/perfilModel");

// Crear perfil académico
router.post("/perfil", (req, res) => {
  const perfil = new perfilSchema(req.body);
  perfil
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.status(400).json({ message: error.message }));
});
// Consultar todos los perfiles
router.get("/perfil", (req, res) => {
  perfilSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});
// Consultar un perfil por ID
router.get("/perfil/:id", (req, res) => {
  const { id } = req.params;
  perfilSchema
    .findById(id)
    .then((data) => {
      if (!data) return res.status(404).json({ message: "Perfil no encontrado" });
      res.json(data);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Editar-actualizar perfil completo
router.put("/perfil/:id", (req, res) => {
  const { id } = req.params;
   const datosActualizados = { ...req.body };

   // Evitar que el usuario cambie su rol
  if (datosActualizados.rolperfil) {
    return res.status(403).json({
      message: "No puedes cambiar tu rol de usuario.",
    });
  }

   // Eliminar _id si viene en el body por error
  delete datosActualizados._id;

  perfilSchema
    .updateOne({ _id: id }, { $set: datosActualizados })
    .then((data) => res.json({ message: "Perfil actualizado correctamente", data }))
    .catch((error) => res.status(400).json({ message: error.message }));
});

//eliminar un perfil por ID
router.delete("/perfil/:id", (req, res) => {
  const { id } = req.params;
  perfilSchema
    .deleteOne({ _id: id })
    .then((data) => res.json({ message: "Perfil eliminado correctamente", data }))
    .catch((error) => res.status(400).json({ message: error.message }));
});
//Eliminar una publicación del historial
router.patch("/perfil/:id/eliminar-publicacion", (req, res) => {
  const { id } = req.params;
  const { publicacion } = req.body;
  perfilSchema
    .updateOne({ _id: id }, { $pull: { historialPublicaciones: publicacion } })
    .then((data) => res.json({ message: "Publicación eliminada del historial", data }))
    .catch((error) => res.status(400).json({ message: error.message }));
});
//Agregar una publicación al historial
router.patch("/perfil/:id/agregar-publicacion", (req, res) => {
  const { id } = req.params;
  const { publicacion } = req.body;
  perfilSchema
    .updateOne({ _id: id }, { $push: { historialPublicaciones: publicacion } })
    .then((data) => res.json({ message: "Publicación agregada al historial", data }))
    .catch((error) => res.status(400).json({ message: error.message }));
});
module.exports = router;