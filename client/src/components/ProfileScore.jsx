function ProfileScore({ user, repos, languages }) {
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0)
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0)
  const langCount = Object.keys(languages).length
  const ownedRepos = repos.filter(r => !r.fork)
  const avgStars = ownedRepos.length > 0 ? totalStars / ownedRepos.length : 0
  const accountAgeYears = (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)
  const reposPerYear = accountAgeYears > 0 ? ownedRepos.length / accountAgeYears : 0

  // --- Score calculation ---

  // Reach (20pts) — followers, logarithmic so 10 followers isn't hopeless
  const reachScore = Math.min(Math.log10(user.followers + 1) / Math.log10(1000) * 20, 20)

  // Impact (20pts) — total stars, logarithmic
  const impactScore = Math.min(Math.log10(totalStars + 1) / Math.log10(5000) * 20, 20)

  // Consistency (20pts) — repos per year, capped at 10/year for full score
  const consistencyScore = Math.min(reposPerYear / 10 * 20, 20)

  // Quality (15pts) — average stars per owned repo, capped at 50 avg stars
  const qualityScore = Math.min(avgStars / 50 * 15, 15)

  // Versatility (15pts) — number of languages, capped at 12
  const versatilityScore = Math.min(langCount / 12 * 15, 15)

  // Community (10pts) — fork ratio (forks / stars), rewards repos people want to build on
  const forkRatio = totalStars > 0 ? totalForks / totalStars : 0
  const communityScore = Math.min(forkRatio / 0.5 * 10, 10)

  const total = Math.round(
    reachScore + impactScore + consistencyScore + qualityScore + versatilityScore + communityScore
  )

  const grade =
    total >= 85 ? { label: 'S', color: '#a78bfa', desc: 'Legendary' } :
    total >= 70 ? { label: 'A', color: '#34d399', desc: 'Expert' }    :
    total >= 50 ? { label: 'B', color: '#60a5fa', desc: 'Advanced' }  :
    total >= 30 ? { label: 'C', color: '#fbbf24', desc: 'Intermediate' } :
                  { label: 'D', color: '#f87171', desc: 'Beginner' }

  const bars = [
    { label: 'Reach',       value: reachScore,       max: 20, color: '#a78bfa', desc: `${user.followers.toLocaleString()} followers` },
    { label: 'Impact',      value: impactScore,       max: 20, color: '#60a5fa', desc: `${totalStars.toLocaleString()} total stars` },
    { label: 'Consistency', value: consistencyScore,  max: 20, color: '#34d399', desc: `${reposPerYear.toFixed(1)} repos/year` },
    { label: 'Quality',     value: qualityScore,      max: 15, color: '#fbbf24', desc: `${avgStars.toFixed(1)} avg stars/repo` },
    { label: 'Versatility', value: versatilityScore,  max: 15, color: '#fb923c', desc: `${langCount} languages` },
    { label: 'Community',   value: communityScore,    max: 10, color: '#e879f9', desc: `${totalForks.toLocaleString()} forks` },
  ]

  const metrics = [
    { icon: '⭐', label: 'Total Stars',     value: totalStars.toLocaleString() },
    { icon: '🍴', label: 'Total Forks',     value: totalForks.toLocaleString() },
    { icon: '📅', label: 'Account Age',     value: `${accountAgeYears.toFixed(1)}y` },
    { icon: '💻', label: 'Languages',       value: langCount },
    { icon: '📁', label: 'Own Repos',       value: ownedRepos.length },
    { icon: '✨', label: 'Avg Stars/Repo',  value: avgStars.toFixed(1) },
  ]

  return (
    <div className="card" style={{ padding: 32 }}>
      <div className="section-title">Profile Score</div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>

        {/* Grade circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 120 }}>
          <div
            className="pulse-glow"
            style={{
              width: 120, height: 120, borderRadius: '50%',
              border: `3px solid ${grade.color}`,
              background: `radial-gradient(circle, ${grade.color}18, transparent 70%)`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: 46, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
              {grade.label}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
              {total}/100
            </span>
          </div>
          <span style={{ fontSize: 13, color: grade.color, fontWeight: 700 }}>{grade.desc}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', maxWidth: 100 }}>
            Top {Math.max(1, 100 - total)}% of devs
          </span>
        </div>

        {/* Score bars */}
        <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
          {bars.map(b => {
            const pct = Math.round((b.value / b.max) * 100)
            return (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{b.label}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{b.desc}</span>
                  </div>
                  <span style={{ fontSize: 12, color: b.color, fontWeight: 700 }}>
                    {b.value.toFixed(1)}/{b.max}
                  </span>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${b.color}66, ${b.color})`,
                    borderRadius: 999,
                    boxShadow: `0 0 10px ${b.color}55`,
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 220, alignContent: 'start' }}>
          {metrics.map(m => (
            <div key={m.label} className="stat-pill">
              <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{m.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ProfileScore