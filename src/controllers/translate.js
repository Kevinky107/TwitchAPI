require('dotenv').config();

const express = require('express');
const deepl = require('deepl-node');

const translator = new deepl.Translator(process.env.DeeplKEY);
const translateController = express.Router();

translateController.get('/:q', async (_req, res, _next) => {
    const q = _req.params.q;
    try {
        const result = await translator.translateText(q, null, 'EN-US');
        return res.status(200).send(result.text);
    } catch (error) {
        console.error('Error en la traducción:', error);
        return res.status(500).json({ error: error.message || 'Error en la traducción' });
    }
});

translateController.get('/es-en/:q', async (_req, res, _next) => {
    const q = _req.params.q;
    try {
        const result = await translator.translateText(q, 'ES', 'EN-US');
        return res.status(200).send(result.text);
    } catch (error) {
        console.error('Error en la traducción:', error);
        return res.status(500).json({ error: error.message || 'Error en la traducción' });
    }
});

translateController.get('/en-es/:q', async (_req, res, _next) => {
    const q = _req.params.q;
    try {
        const result = await translator.translateText(q, null, 'ES');
        return res.status(200).send(result.text);
    } catch (error) {
        console.error('Error en la traducción:', error);
        return res.status(500).json({ error: error.message || 'Error en la traducción' });
    }
});

module.exports = { translateController };
