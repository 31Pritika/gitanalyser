import { useState } from 'react'
import axios from 'axios'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import RepoList from './components/RepoList'
import LanguageChart from './components/LanguageChart'
import SkeletonLoader from './components/SkeletonLoader'
import ProfileScore from './components/ProfileScore'

function App() {
  const [userData, setUserData] = useState(null)
  const [repos, setRepos] = useState([])
  const [languages, setLanguages] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  

  const handleSearch = async (username) => {
    setLoading(true)
    setError(null)
    setUserData(null)
    setRepos([])
    setLanguages({})

    try {
      const [userRes, reposRes, langsRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/${username}`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/repos/${username}`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/languages/${username}`)
    ])
      setUserData(userRes.data)
      setRepos(reposRes.data)
      setLanguages(langsRes.data)
    } catch {
      setError('User not found. Check the username and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#070710', position: 'relative', overflowX: 'hidden' }}>

      {/* Orbs */}
      <div className="orb" style={{ width: 600, height: 600, top: -200, left: '10%', background: '#7c3aed', opacity: 0.12 }} />
      <div className="orb" style={{ width: 500, height: 500, top: '40%', right: '-100px', background: '#2563eb', opacity: 0.1 }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: '5%', left: '20%', background: '#059669', opacity: 0.08 }} />

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(139,92,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 920, margin: '0 auto', padding: '80px 32px 120px' }}>

        {/* Hero */}
        <div className="anim-fadeInUp" style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 className="glow-text" style={{ fontSize: 70, fontWeight: 900, lineHeight: 1.05, marginBottom: 20, letterSpacing: '-2px' }}>
            GitInsight
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 19, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Deep dive into any developer's GitHub profile with insightful analytics
          </p>
        </div>

        {/* Search */}
        <div className="anim-delay1" style={{ marginBottom: 16 }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Helper text */}
        {!userData && !loading && !error && (
          <p className="anim-delay2" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, marginTop: 16 }}>
            Try searching for <span style={{ color: '#a78bfa' }}>torvalds</span>, <span style={{ color: '#60a5fa' }}>gaearon</span>, or your own username
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="anim-fadeInUp" style={{
            marginTop: 32, padding: '18px 24px', borderRadius: 16, textAlign: 'center',
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Skeleton */}
        {loading && <SkeletonLoader />}

        {/* Results */}
        {userData && !loading && (
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="anim-fadeInUp"><ProfileCard user={userData} /></div>
            <div className="anim-delay1"><ProfileScore user={userData} repos={repos} languages={languages} /></div>
            <div className="anim-delay2">{Object.keys(languages).length > 0 && <LanguageChart languages={languages} />}</div>
            <div className="anim-delay3">{repos.length > 0 && <RepoList repos={repos} />}</div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App