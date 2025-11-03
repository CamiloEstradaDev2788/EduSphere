const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

console.log("🔑 API Key detectada:", process.env.OPENAI_API_KEY ? "Sí" : "No");

// POST /api/chat
router.post("/", async (req, res) => {
try {
    const { prompt } = req.body;

    if (!prompt) {
    return res.status(400).json({ message: "Falta el campo 'prompt' en el cuerpo de la petición." });
    }

    // Llamada al modelo de ChatGPT (GPT-4o o GPT-5, según tu cuenta)
    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "Eres un asistente útil conectado a una app educativa." },
        { role: "user", content: prompt }
    ]
    });

    res.json({
    response: completion.choices[0].message.content
    });
} catch (error) {
    console.error("Error al conectar con ChatGPT:", error);
    res.status(500).json({ message: "Error al procesar la solicitud.", error: error.message });
}
});


module.exports = router;
