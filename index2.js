const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(300).json({user:"superSecretPasswordForRemoteCloudConnexion"})
});

app.listen(PORT, () => {
    console.log("test")
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
