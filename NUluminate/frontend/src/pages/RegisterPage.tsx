import { useState } from 'react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.endsWith('@nu-laguna.edu.ph')) {
      setError('Only @nu-laguna.edu.ph emails are allowed!')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      })
      const data = await response.json()
      if (data.success) {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => window.location.href = '/login', 2000)
      } else {
        setError(data.message)
      }
    } catch {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600' as const,
    marginBottom: '6px',
    color: '#333'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#003087',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#FFC72C',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '24px'
          }}>💛</div>
          <h1 style={{ color: '#003087', fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
            NUluminate
          </h1>
          <p style={{ color: '#666', fontSize: '13px', margin: '4px 0 0' }}>
            Create your account
          </p>
          <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2', color: '#dc2626',
            padding: '10px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '14px'
          }}>{error}</div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#dcfce7', color: '#16a34a',
            padding: '10px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '14px'
          }}>{success}</div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>NU Email</label>
            <input
              type="email"
              placeholder="yourname@nu-laguna.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: '#003087',
              color: 'white', border: 'none',
              borderRadius: '8px', fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ fontSize: '13px', color: '#666' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#003087', fontWeight: '600' }}>
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}