import { useRef } from 'react'
import html2canvas from 'html2canvas'

function ShareCard({ user, repos, languages, summary, score, grade }) {
  const cardRef = useRef()

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0)
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0)
  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)

  const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb923c']

  const handleDownload = async () => {
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    const link = document.createElement('a')
    link.download = `${user.login}-github-card.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="card" style={{ padding: 32 }}>
      <div className="section-title">Shareable Card</div>

      {/* The card to be captured */}
      <div ref={cardRef} style={{
        background: 'linear-gradient(135deg, #0d0d1a 0%, #0a0a1f 50%, #0d0a1a 100%)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: 24,
        padding: 36,
        maxWidth: 600,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(124,58,237,0.15)', filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(37,99,235,0.1)', filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28 }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            crossOrigin="anonymous"
            style={{
              width: 72, height: 72, borderRadius: 16,
              border: '2px solid rgba(139,92,246,0.5)'
            }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>
              {user.name || user.login}
            </h2>
            <p style={{ color: '#a78bfa', fontSize: 13, marginBottom: 6 }}>@{user.login}</p>
            {user.bio && (
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.5 }}>
                {user.bio.slice(0, 80)}{user.bio.length > 80 ? '...' : ''}
              </p>
            )}
          </div>

          {/* Grade */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: `2px solid ${grade.color}`,
            background: `radial-gradient(circle, ${grade.color}20, transparent)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
              {grade.label}
            </span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{score}/100</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Followers',  value: user.followers.toLocaleString() },
            { label: 'Repos',      value: user.public_repos },
            { label: 'Stars',      value: totalStars.toLocaleString() },
            { label: 'Forks',      value: totalForks.toLocaleString() },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '12px 8px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Top Languages
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {topLangs.map((lang, i) => (
              <span key={lang} style={{
                background: `${COLORS[i]}18`,
                border: `1px solid ${COLORS[i]}40`,
                color: COLORS[i],
                borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600
              }}>
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        {summary && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 20, marginBottom: 20
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 12,
              lineHeight: 1.8, fontStyle: 'italic'
            }}>
              "{summary.slice(0, 180)}{summary.length > 180 ? '...' : ''}"
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            github.com/{user.login}
          </span>
          <span style={{
            fontSize: 11, color: '#a78bfa',
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 999, padding: '3px 12px'
          }}>
            GitHub Analyser
          </span>
        </div>
      </div>

      {/* Download button */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={handleDownload}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white', border: 'none',
            padding: '14px 40px', borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        >
          ⬇ Download Card
        </button>
      </div>
    </div>
  )
}

export default ShareCard