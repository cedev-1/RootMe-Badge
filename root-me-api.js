// root-me-api.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors'); 
const app = express();
const PORT = 3000;

app.use(cors()); 

async function fetchData(url) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    };
    const response = await axios.get(url, { headers });
    return cheerio.load(response.data);
}

app.get('/api/rootme/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const url = `https://www.root-me.org/${username}`;
        const $ = await fetchData(url);

        const ranking = $('div.small-6.medium-3.columns.text-center h3').first().text().trim();
        const score = $('div.small-6.medium-3.columns.text-center').find('span.gras:contains("Points")').parent().find('h3').text().trim();
        const challenges = $('div.small-6.medium-3.columns.text-center').find('span.gras:contains("Challenges")').parent().find('h3').text().trim();

        res.json({ username, ranking, score, challenges });
    } catch (error) {
        res.status(500).json({ error: 'Erreur.' });
    }
});
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
