const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require("groq-sdk");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Initialize Groq safely
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {};

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers })
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
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
Summarize this GitHub developer in 3-4 sentences. Be clear, insightful, and human.

Username: ${user.login}
Bio: ${user.bio || 'N/A'}
Followers: ${user.followers}
Repos: ${user.public_repos}
Stars: ${totalStars}
Top repos: ${topRepos}
Account age: ${accountAge} years
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const summary = chatCompletion.choices[0]?.message?.content;

    res.json({ summary });

  } catch (error) {
    console.log("GROQ ERROR:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      debug: error.message
    });
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