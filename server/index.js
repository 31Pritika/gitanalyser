const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

console.log("TOKEN:", process.env.GITHUB_TOKEN);
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/repos/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

app.get('/api/languages/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Step 1: get all repos
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      }
    );

    const repos = reposResponse.data;

    // Step 2: for each repo, fetch its language breakdown
    const languagePromises = repos.map(repo =>
      axios.get(repo.languages_url, {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      })
    );

    const languageResponses = await Promise.all(languagePromises);

    // Step 3: combine all language data into one object
    const languageTotals = {};
    languageResponses.forEach(response => {
      const langs = response.data;
      for (const [language, bytes] of Object.entries(langs)) {
        languageTotals[language] = (languageTotals[language] || 0) + bytes;
      }
    });

    res.json(languageTotals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


