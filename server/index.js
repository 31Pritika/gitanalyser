const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS (allow your frontend)
app.use(cors({
  origin: "https://gitinsight-kappa.vercel.app/",
  methods: ['GET', 'POST']
}));

app.use(express.json());

// ------------------ USER ------------------
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// ------------------ REPOS ------------------
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

// ------------------ LANGUAGES ------------------
app.get('/api/languages/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}
      }
    );

    const repos = reposResponse.data;

    const languagePromises = repos.map(repo =>
      axios.get(repo.languages_url, {
        headers: process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}
      })
    );

    const languageResponses = await Promise.all(languagePromises);

    const languageTotals = {};
    languageResponses.forEach(response => {
      for (const [lang, bytes] of Object.entries(response.data)) {
        languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
      }
    });

    res.json(languageTotals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});