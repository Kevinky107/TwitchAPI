const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const discordController = express.Router();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DISCORD_WEBHOOK_URL_SPANISH = process.env.DISCORD_WEBHOOK_URL_SPANISH;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generarAudio(texto) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/audio/speech',
            {
                model: 'tts-1-hd',
                input: texto,
                voice: 'nova'
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        const filePath = '/tmp/output.mp3';
        fs.writeFileSync(filePath, response.data);
        return filePath;
    } catch (error) {
        console.error('Error generando el audio:', error);
        throw new Error('Error en la generación de audio');
    }
}


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

const FormData = require('form-data');

discordController.get("/spanish", async (req, res) => {
    const { mensaje } = req.query;

    if (!mensaje) {
        return res.status(400).send("Faltan parámetros");
    }

    try {
        await axios.post(DISCORD_WEBHOOK_URL_SPANISH, {
            content: `💃🏻 Spanish lesson: ${mensaje}`
        });

        const match = mensaje.match(/"([^"]+)"/)[1];
        const textoParaAudio = match ? `La palabra en español del día es ${match} ` : mensaje;

        const filePath = await generarAudio(textoParaAudio);
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath), { filename: 'spanish_lesson.mp3' });

        await axios.post(DISCORD_WEBHOOK_URL_SPANISH, form, {
            headers: { ...form.getHeaders() }
        });

        res.send("Spanish lesson sent to discord 💃🏻");
    } catch (error) {
        console.error("Error enviando mensaje a Discord:", error);
        res.status(500).send("Error al enviar mensaje");
    }
});

module.exports = { discordController };
