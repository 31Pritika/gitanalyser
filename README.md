# What is GitInsight?
GitInsight is a full stack GitHub profile analyser that lets you uncover deep insights about any developer. Enter a GitHub username and get a dashboard showing their profile stats, language breakdown, top repos, an AI-generated summary, and a downloadable profile card.

## Features

**Profile Analytics**: Followers, following, repo count, account age, location, etc <br>
**Profile Score & Grade**: Scoring across 6 dimensions: Reach, Impact, Consistency, Quality, Versatility, and Community<br>
**Language Breakdown**: Donut chart showing languages used <br>
**Repository Insights**: All public repos sorted by stars with language tags and topics<br>
**AI Summary**: Groq-powered plain summary of the profile<br>
**Shareable Card**: Downloadable PNG card with all key stats<br>
**Animated Skeleton Loader**: Smooth loading experience while data is being fetched<br>
**Glassmorphism UI**: Modern dark theme with frosted glass cards<br>

## Tech Stack
### Frontend

React + Vite<br>
Tailwind CSS<br>
Recharts (data visualisation)<br>
html2canvas (card download)<br>
Axios

### Backend

Node.js + Express<br>
GitHub REST API<br>
Groq API <br>
dotenv, cors<br>

### Deployment

Frontend → Vercel Check out: https://gitinsight-kappa.vercel.app/ <br> 
Backend → Render<br>
