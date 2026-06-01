import { useState, useEffect } from 'react'

const moodEmoji: Record<string, string> = {
  HAPPY: '😊',
  OKAY: '😐',
  STRESSED: '😰',
  EXHAUSTED: '😩'
}

const moodColor: Record<string, string> = {
  HAPPY: '#22c55e',
  OKAY: '#3b82f6',
  STRESSED: '#f59e0b',
  EXHAUSTED: '#ef4444'
}

interface CheckIn {
  id: number
  mood: string
  stressLevel: number
  isAnonymous: boolean
  submittedAt: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1'
    fetch(`http://localhost:8080/api/v1/checkins/my-history/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.data)
        } else {
          setError('Failed to load history')
        }
      })
      .catch(() => setError('Cannot connect to server'))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const stressBar = (level: number) => {
    const colors = ['', '#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444']
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: '20px', height: '8px', borderRadius: '4px',
            backgroundColor: i <= level ? colors[level] : '#e5e7eb'
          }} />
        ))}
        <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
          {level}/5
        </span>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f4ff',
      fontFamily: 'Arial, sans-serif',
      padding: '24px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          backgroundColor: '#003087',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
          <h1 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>
            My Wellness History
          </h1>
          <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: '13px' }}>
            Your past check-ins
          </p>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', gap: '10px',
          marginBottom: '20px'
        }}>
          <a href="/checkin" style={{
            flex: 1, padding: '10px',
            backgroundColor: '#003087', color: 'white',
            borderRadius: '8px', textAlign: 'center',
            textDecoration: 'none', fontSize: '14px', fontWeight: '600'
          }}>+ New Check-In</a>
          <a href="/login" style={{
            padding: '10px 16px',
            backgroundColor: 'white', color: '#666',
            borderRadius: '8px', textAlign: 'center',
            textDecoration: 'none', fontSize: '14px',
            border: '1px solid #ddd'
          }}>Sign Out</a>
        </div>

        {/* Content */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading your history...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2', color: '#dc2626',
            padding: '14px', borderRadius: '10px', fontSize: '14px'
          }}>{error}</div>
        )}

        {!loading && !error && history.length === 0 && (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            padding: '40px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: '#666', fontSize: '15px' }}>No check-ins yet!</p>
            <a href="/checkin" style={{ color: '#003087', fontWeight: '600' }}>
              Submit your first check-in →
            </a>
          </div>
        )}

        {/* Check-in Cards */}
        {history.map((item, index) => (
          <div key={item.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${moodColor[item.mood] || '#ccc'}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{moodEmoji[item.mood]}</span>
                  <span style={{
                    fontSize: '16px', fontWeight: '700',
                    color: moodColor[item.mood]
                  }}>{item.mood}</span>
                  {item.isAnonymous && (
                    <span style={{
                      fontSize: '11px', backgroundColor: '#f3f4f6',
                      color: '#666', padding: '2px 8px', borderRadius: '99px'
                    }}>Anonymous</span>
                  )}
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>
                    Stress Level:
                  </span>
                  <div style={{ marginTop: '4px' }}>{stressBar(item.stressLevel)}</div>
                </div>
                <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0' }}>
                  🕐 {formatDate(item.submittedAt)}
                </p>
              </div>
              <span style={{
                backgroundColor: '#f0f4ff',
                color: '#003087', fontWeight: '700',
                fontSize: '13px', padding: '4px 10px',
                borderRadius: '99px'
              }}>#{index + 1}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}