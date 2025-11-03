const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Crear nueva publicación
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title y content son obligatorios" });
    }

    const newPost = new Post({ title, content, author });
    await newPost.save();

    res.status(201).json({ message: "Publicación creada", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la publicación", error: error.message });
  }
});

// Obtener todas las publicaciones
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
  }
});

// Obtener publicación por ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la publicación", error: error.message });
  }
});

// Actualizar publicación por ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json({ message: "Publicación actualizada", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la publicación", error: error.message });
  }
});

//Eliminar publicación por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json({ message: "Publicación eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la publicación", error: error.message });
  }
});

module.exports = router;
