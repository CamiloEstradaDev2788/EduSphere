const express = require("express");
const router = express.Router();
const Perfil = require("../models/perfilModel");
const verificarAdmin = require("../middlewares/auth");

router.use(verificarAdmin);


/* =============================
   RUTAS DE ADMINISTRADOR
============================= */

// Obtener todos los perfiles
router.get("/admin/perfiles", (req, res) => {
  Perfil.find()
    .then((data) => res.json(data))
    .catch((error) =>
      res.status(500).json({ message: "Error al obtener perfiles", error })
    );
});

// Obtener todos los administradores
router.get("/admin/administradores", (req, res) => {
  Perfil.find({ rolperfil: "administrador" })
    .then((data) => res.json(data))
    .catch((error) =>
      res.status(500).json({ message: "Error al obtener administradores", error })
    );
});

// Buscar perfil por ID (para admin)
router.get("/admin/perfil/:id", (req, res) => {
  const { id } = req.params;

  Perfil.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }
      res.json(data);
    })
    .catch((error) =>
      res.status(500).json({ message: "Error al buscar el perfil", error })
    );
});

// Cambiar el rol de un usuario
router.patch("/admin/cambiar-rol/:id", (req, res) => {
  const { id } = req.params;
  const { nuevoRol } = req.body;

  if (!["usuario", "administrador"].includes(nuevoRol)) {
    return res.status(400).json({ message: "Rol no válido" });
  }

  Perfil.updateOne({ _id: id }, { $set: { rolperfil: nuevoRol } })
    .then((data) => {
      if (data.matchedCount === 0) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }
      // Evitar que un administrador se degrade a sí mismo
        if (req.body.nuevoRol === "usuario" && id === req.body.idAdmin) {
        return res.status(403).json({ message: "No puedes cambiar tu propio rol." });
        }
      res.json({ message: `Rol actualizado a ${nuevoRol}`, data });
    })
    .catch((error) =>
      res.status(400).json({ message: "Error al actualizar rol", error })
    );
});

// Editar cualquier perfil incluido el propio.
router.patch("/admin/editar-perfil/:id", (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  // Evitar que el admin cambie roles desde aquí
  if (datosActualizados.rolperfil) {
    return res.status(400).json({
      message:
        "No puedes cambiar el rol desde esta ruta. Usa /admin/cambiar-rol/:id",
    });
  }
  // No permitir cambiar el _id
  if (datosActualizados._id) delete datosActualizados._id;

  Perfil.updateOne({ _id: id }, { $set: datosActualizados })
    .then((data) => {
      if (data.matchedCount === 0)
        return res.status(404).json({ message: "Perfil no encontrado" });

      res.json({
        message: "Perfil actualizado correctamente por el administrador",
        data,
      });
    })
    .catch((error) =>
      res.status(400).json({ message: "Error al actualizar perfil", error })
    );
});



// Eliminar cualquier perfil (usuario o admin)
router.delete("/admin/eliminar-perfil/:id", (req, res) => {
  const { id } = req.params;
    const { idAdmin } = req.body; // ID del admin que hace la solicitud

    // No es posible eliminar su propia cuenta
  if (id === idAdmin) {
    return res.status(403).json({
      message: "No puedes eliminar tu propia cuenta de administrador.",
    });
  }

  Perfil.deleteOne({ _id: id })
    .then((data) => {
      if (data.deletedCount === 0)
        return res.status(404).json({ message: "Perfil no encontrado" });

      res.json({ message: "Perfil eliminado correctamente", data });
    })
    .catch((error) =>
      res.status(400).json({ message: "Error al eliminar perfil", error })
    );
});

// Obtener todas las publicaciones de un usuario por ID
router.get("/admin/publicaciones/:id", (req, res) => {
  const { id } = req.params;

  Perfil.findById(id)
    .then((perfil) => {
      if (!perfil) {
        return res.status(404).json({ message: "Perfil no encontrado" });
      }
      res.json({
        mensaje: `Historial de publicaciones de ${perfil.nombre}`,
        publicaciones: perfil.historialPublicaciones,
      });
    })
    .catch((error) =>
      res.status(500).json({ message: "Error al obtener publicaciones", error })
    );
});

// Eliminar una publicación del historial de un usuario
router.patch("/admin/eliminar-publicacion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { publicacion } = req.body;

    if (!publicacion) {
      return res.status(400).json({ message: "Debes especificar la publicación" });
    }

    // Buscar el perfil
    const perfil = await Perfil.findById(id);
    if (!perfil) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    // Verificar si la publicación existe en el historial
    const index = perfil.historialPublicaciones.findIndex(
      (pub) => pub.trim().toLowerCase() === publicacion.trim().toLowerCase()
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ message: "La publicación no existe en el historial del usuario." });
    }

    // Eliminar la publicación
    perfil.historialPublicaciones.splice(index, 1);
    await perfil.save();

    res.json({
      message: `Publicación "${publicacion}" eliminada correctamente del historial.`,
      historialActualizado: perfil.historialPublicaciones,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al eliminar publicación", error: error.message });
  }
});
module.exports = router;