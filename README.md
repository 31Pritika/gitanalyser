# What is GitInsight?
GitInsight is a full stack GitHub profile analyser that lets you uncover deep insights about any developer. Enter a GitHub username and instantly get a beautiful dashboard showing their profile stats, language breakdown, top repositories, an AI-generated developer summary, and a downloadable profile card.

## Features

Profile Analytics — Followers, following, repo count, account age, location, and more
Profile Score & Grade — Sophisticated scoring across 6 dimensions: Reach, Impact, Consistency, Quality, Versatility, and Community
Language Breakdown — Interactive donut chart showing languages used weighted by lines of code
Repository Insights — All public repos sorted by stars with language tags and topics
AI Summary — Gemini-powered plain English summary of the developer's profile
Shareable Card — Downloadable PNG card with all key stats, perfect for sharing on LinkedIn or Twitter
Animated Skeleton Loader — Smooth loading experience while data is being fetched
Glassmorphism UI — Modern dark theme with frosted glass cards, glowing orbs, and smooth animations


Tech Stack
Frontend

React + Vite
Tailwind CSS
Recharts (data visualisation)
html2canvas (card download)
Axios

Backend

Node.js + Express
GitHub REST API
Google Gemini API (AI summary)
dotenv, cors

Deployment

Frontend → Vercel
Backend → Render
