const express = require('express');
const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv').config();

const discordController = express.Router();

const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

bot.on("ready", () => {
    console.log(`🤖 Hi! i'm a bot created by the awesome Kevinky and i'm here to please all your requests`);
});
bot.login(DISCORD_BOT_TOKEN);

discordController.get("/note", async (req, res) => {
    const { usuario, mensaje } = req.query;

    if (!usuario || !mensaje) {
        return res.status(400).send("Faltan parámetros");
    }

    try {
        const channel = await bot.channels.cache.get(CHANNEL_ID)
        if (channel) {
            await channel.send(`📒✏️ **${usuario}** wants you to note down: ${mensaje}`);
            res.send("Thx for your note, I sent it to our discord channel! 📒✏️");
        } else {
            res.status(404).send("No se encontró el canal de Discord");
        }
    } catch (error) {
        console.error("Error enviando mensaje a Discord:", error);
        res.status(500).send("Error al enviar mensaje");
    }
});

module.exports = { discordController };
