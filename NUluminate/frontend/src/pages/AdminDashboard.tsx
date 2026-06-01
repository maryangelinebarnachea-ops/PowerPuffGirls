import { useState, useEffect } from 'react'

const moodEmoji: Record<string, string> = {
  HAPPY: '😊', OKAY: '😐', STRESSED: '😰', EXHAUSTED: '😩'
}
const moodColor: Record<string, string> = {
  HAPPY: '#22c55e', OKAY: '#3b82f6', STRESSED: '#f59e0b', EXHAUSTED: '#ef4444'
}

interface CheckIn {
  id: number
  mood: string
  stressLevel: number
  isAnonymous: boolean
  submittedAt: string
  user?: { id: number; email: string; name: string }
}

export default function AdminDashboard() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/faculty/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCheckIns(data.data)
        else setError('Failed to load dashboard')
      })
      .catch(() => setError('Cannot connect to server'))
      .finally(() => setLoading(false))
  }, [])

  // Stats
  const total = checkIns.length
  const moodCounts = checkIns.reduce((acc, c) => {
    acc[c.mood] = (acc[c.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const avgStress = total > 0
    ? (checkIns.reduce((sum, c) => sum + c.stressLevel, 0) / total).toFixed(1)
    : '0'
  const highStress = checkIns.filter(c => c.stressLevel >= 4).length

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f0f4ff',
      fontFamily: 'Arial, sans-serif', padding: '24px 20px'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          backgroundColor: '#003087', borderRadius: '16px',
          padding: '24px', marginBottom: '20px', color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>
                🖥️ Faculty Dashboard
              </h1>
              <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '13px' }}>
                NUluminate — Student Wellness Overview
              </p>
            </div>
            <a href="/login" style={{
              color: 'white', fontSize: '13px', opacity: 0.8,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.4)',
              padding: '6px 12px', borderRadius: '8px'
            }}>Sign Out</a>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Check-ins', value: total, icon: '📋', color: '#003087' },
            { label: 'Avg Stress Level', value: `${avgStress}/5`, icon: '📊', color: '#f59e0b' },
            { label: 'High Stress (≥4)', value: highStress, icon: '⚠️', color: '#ef4444' },
          ].map(card => (
            <div key={card.label} style={{
              backgroundColor: 'white', borderRadius: '12px',
              padding: '16px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: `4px solid ${card.color}`
            }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{card.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: card.color }}>
                {card.value}
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mood Distribution */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          padding: '20px', marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', color: '#333' }}>
            😊 Mood Distribution
          </h2>
          {total === 0 ? (
            <p style={{ color: '#999', fontSize: '14px' }}>No data yet</p>
          ) : (
            ['HAPPY', 'OKAY', 'STRESSED', 'EXHAUSTED'].map(mood => {
              const count = moodCounts[mood] || 0
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={mood} style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '4px', fontSize: '13px'
                  }}>
                    <span>{moodEmoji[mood]} {mood}</span>
                    <span style={{ color: '#666' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ backgroundColor: '#f3f4f6', borderRadius: '99px', height: '10px' }}>
                    <div style={{
                      width: `${pct}%`, height: '10px',
                      backgroundColor: moodColor[mood],
                      borderRadius: '99px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Recent Check-ins Table */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', color: '#333' }}>
            📝 Recent Check-ins
          </h2>

          {loading && <p style={{ color: '#999' }}>Loading...</p>}
          {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}

          {!loading && checkIns.length === 0 && (
            <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
              No check-ins submitted yet
            </p>
          )}

          {checkIns.map((item) => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{moodEmoji[item.mood]}</span>
                <div>
                  <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: moodColor[item.mood] }}>
                    {item.mood}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#999' }}>
                    {item.isAnonymous
                      ? '🔒 Anonymous'
                      : (item.user?.name || item.user?.email || 'Unknown')}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0', fontSize: '13px', fontWeight: '600', color: item.stressLevel >= 4 ? '#ef4444' : '#555' }}>
                  Stress: {item.stressLevel}/5 {item.stressLevel >= 4 ? '⚠️' : ''}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#aaa' }}>
                  {formatDate(item.submittedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}