# What is GitInsight?
GitInsight is a full stack GitHub profile analyser that lets you uncover deep insights about any developer. Enter a GitHub username and get a dashboard showing their profile stats, language breakdown, top repos, an AI-generated summary, and a downloadable profile card.

## Features

**Profile Analytics**  — Followers, following, repo count, account age, location, etc
**Profile Score & Grade** — Scoring across 6 dimensions: Reach, Impact, Consistency, Quality, Versatility, and Community
**Language Breakdown** — Donut chart showing languages used 
**Repository Insights** — All public repos sorted by stars with language tags and topics
**AI Summary** — Groq-powered plain summary of the profile
**Shareable Card** — Downloadable PNG card with all key stats
**Animated Skeleton Loader** — Smooth loading experience while data is being fetched
**Glassmorphism UI** — Modern dark theme with frosted glass cards

## Tech Stack
### Frontend

React + Vite
Tailwind CSS
Recharts (data visualisation)
html2canvas (card download)
Axios

### Backend

Node.js + Express
GitHub REST API
Google Gemini API (AI summary)
dotenv, cors

### Deployment

Frontend → Vercel
Backend → Render
