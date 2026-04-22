const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Initialize Gemini safely
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ✅ TEMP: Allow all CORS (fix your mobile issue first)
app.use(cors());

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
    console.error(error.response?.data || error.message);
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
    console.error(error.response?.data || error.message);
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

    // ✅ LIMIT repos to avoid rate limit
    const repos = reposResponse.data.slice(0, 20);

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
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

// ------------------ SUMMARY ------------------
app.get('/api/summary/:username', async (req, res) => {
  const { username } = req.params;

  try {
    if (!genAI) {
      return res.status(500).json({ error: 'Missing Gemini API key' });
    }

    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {};

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100`,
        { headers }
      )
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
    const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);

    const ownedRepos = repos.filter(r => !r.fork);

    const topRepos = [...ownedRepos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map(r => r.name)
      .join(', ');

    const accountAge = (
      (new Date() - new Date(user.created_at)) /
      (1000 * 60 * 60 * 24 * 365)
    ).toFixed(1);

    const prompt = `
You are analysing a GitHub developer profile. Write a 3-4 sentence professional yet engaging summary of this developer based on their stats. Be specific, insightful, and human. Do not use bullet points. Do not start with "This developer".

Developer stats:
- Username: ${user.login}
- Name: ${user.name || 'Not provided'}
- Bio: ${user.bio || 'Not provided'}
- Account age: ${accountAge} years
- Followers: ${user.followers}
- Following: ${user.following}
- Public repos: ${user.public_repos}
- Own repos (not forked): ${ownedRepos.length}
- Total stars earned: ${totalStars}
- Total forks: ${totalForks}
- Location: ${user.location || 'Not provided'}
- Top repos: ${topRepos || 'None'}

Write only the summary, nothing else.
    `;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    });

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error(error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// ------------------ ROOT ------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});