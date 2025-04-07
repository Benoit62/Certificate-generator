const express = require('express');
const bodyParser = require('body-parser');
const wkhtmltopdf = require('wkhtmltopdf');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/certificate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'certificate.html'));
});

app.post('/generate-pdf', (req, res) => {
    const { firstName, lastName } = req.body;

    // Configuration SSRF dangereuse - génération de PDF via wkhtmltopdf
    // avec une entrée utilisateur non validée
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Certificat de Participation</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
            }
            .certificate { 
                border: 5px solid #000;
                width: 80%;
                margin: 0 auto;
                padding: 20px;
                position: relative;
            }
            .certif {
                position: absolute;
                top: 30px;
                left: 60px;
                max-width: 50px;
                max-height: 50px;
            }.certif2 {
                position: absolute;
                top: 30px;
                right: 60px;
                max-width: 50px;
                max-height: 50px;
            }
            .name {
                color: #242A75;
                font-weight: bold;
            }
            .logo {
                max-width: 300px;
                max-height: 300px;
                display: block;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <img src="http://localhost:${PORT}/medaille.png" alt="Icone" class="certif">
            <img src="http://localhost:${PORT}/medaille.png" alt="Icone" class="certif2">
            <h1>Certificat de Participation</h1>
            <p>Décerné à : <span class="name">${firstName} ${lastName}</span></p>
            <p>Pour sa participation au forum</p>
            <img src="http://localhost:${PORT}/logo.jpg" alt="Logo" class="logo">
        </div>
    </body>
    </html>
    `;

    const pdfPath = path.join(__dirname, 'certificate.pdf');
    wkhtmltopdf(htmlContent, { output: pdfPath }, (err, stream) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Erreur lors de la génération du PDF');
        }
        res.download(pdfPath, 'certificate.pdf', () => {
            fs.unlinkSync(pdfPath); // Supprimer le fichier après le téléchargement
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
