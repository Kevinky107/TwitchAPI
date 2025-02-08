const dotenv = require('dotenv');
const { translateController } = require('./controllers/translate');
const { discordController } = require('./controllers/discord');
const cors = require('cors');

dotenv.config();

const express = require('express');

const app = express();

app.use(cors())
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({extended: true}));

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.use('/translate', translateController);
app.use('/discord', discordController);

module.exports = { app };
