import { useState } from 'react'

const moods = [
  { value: 'HAPPY', emoji: '😊', label: 'Happy', color: '#22c55e' },
  { value: 'OKAY', emoji: '😐', label: 'Okay', color: '#3b82f6' },
  { value: 'STRESSED', emoji: '😰', label: 'Stressed', color: '#f59e0b' },
  { value: 'EXHAUSTED', emoji: '😩', label: 'Exhausted', color: '#ef4444' },
]

export default function CheckInPage() {
  const [selectedMood, setSelectedMood] = useState('')
  const [stressLevel, setStressLevel] = useState(3)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedMood) {
      setError('Please select your mood!')
      return
    }

    setLoading(true)
    try {
      const userId = localStorage.getItem('userId') || '1'
      const response = await fetch('http://localhost:8080/api/v1/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          stressLevel,
          isAnonymous,
          userId: parseInt(userId)
        })
      })
      const data = await response.json()
      if (data.success) {
        setSuccess('Check-in submitted successfully! 🎉')
        setSelectedMood('')
        setStressLevel(3)
        setIsAnonymous(false)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch {
      setError('Cannot connect to server. Make sure backend is running!')
    } finally {
      setLoading(false)
    }
  }

  const stressLabels: Record<number, string> = {
    1: '😌 Very Low',
    2: '🙂 Low',
    3: '😐 Moderate',
    4: '😟 High',
    5: '😫 Very High'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f4ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            backgroundColor: '#003087',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '28px'
          }}>💙</div>
          <h1 style={{ color: '#003087', fontSize: '22px', fontWeight: 'bold', margin: '0' }}>
            Wellness Check-In
          </h1>
          <p style={{ color: '#666', fontSize: '13px', margin: '6px 0 0' }}>
            How are you feeling today?
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2', color: '#dc2626',
            padding: '10px 14px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '14px'
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            backgroundColor: '#dcfce7', color: '#16a34a',
            padding: '10px 14px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '14px'
          }}>{success}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Mood Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '15px',
              fontWeight: '700', marginBottom: '12px', color: '#333'
            }}>
              Select your mood
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  style={{
                    padding: '16px',
                    border: selectedMood === mood.value
                      ? `3px solid ${mood.color}`
                      : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    backgroundColor: selectedMood === mood.value
                      ? `${mood.color}15`
                      : 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: selectedMood === mood.value ? mood.color : '#555',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                  <span style={{ fontSize: '28px' }}>{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '15px',
              fontWeight: '700', marginBottom: '8px', color: '#333'
            }}>
              Stress Level — <span style={{ color: '#003087' }}>{stressLabels[stressLevel]}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#003087' }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: '#999', marginTop: '4px'
            }}>
              <span>1 - Very Low</span>
              <span>5 - Very High</span>
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div style={{
            marginBottom: '28px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ margin: '0', fontWeight: '600', fontSize: '14px', color: '#333' }}>
                Submit anonymously
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>
                Your name won't be linked to this check-in
              </p>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#003087' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              backgroundColor: '#003087',
              color: 'white', border: 'none',
              borderRadius: '10px', fontSize: '16px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Submitting...' : '✅ Submit Check-In'}
          </button>
        </form>

        {/* Navigation */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <a href="/history" style={{ color: '#003087', fontSize: '13px', marginRight: '16px' }}>
            📋 View My History
          </a>
          <a href="/login" style={{ color: '#999', fontSize: '13px' }}>
            Sign Out
          </a>
        </div>

      </div>
    </div>
  )
}