const express = require('express');
const axios = require('axios');
require('dotenv').config();

const discordController = express.Router();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

discordController.get("/note", async (req, res) => {
    const { usuario, mensaje } = req.query;

    if (!usuario || !mensaje) {
        return res.status(400).send("Faltan parámetros");
    }

    try {
        await axios.post(DISCORD_WEBHOOK_URL, {
            content: `📒✏️ **${usuario}** wants you to note down: ${mensaje}`
        });

        res.send("Thx for your note, I sent it to our discord channel! 📒✏️");
    } catch (error) {
        console.error("Error enviando mensaje a Discord:", error);
        res.status(500).send("Error al enviar mensaje");
    }
});

module.exports = { discordController };
