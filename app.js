const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

function startServer() {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        console.log(`Server läuft auf Port ${PORT}`);
    });
    return server;
}

if (require.main === module) {
    // Direkter Aufruf, starte den Server!
    startServer();
}

module.exports = { app, startServer }; // Exportieren für Testzwecke