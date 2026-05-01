import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (!token) {
      setStatus('error')
      navigate('/login')
      return
    }

    localStorage.setItem('token', token)

    // Retry mechanism for profile API
    let retries = 0
    const maxRetries = 3
    let retryTimer = null

    const fetchProfileWithRetry = () => {
      retries++

      authAPI
        .getProfile()
        .then(data => {
          if (data?.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
            setStatus('success')
            // Force full page reload to ensure all contexts re-initialize
            window.location.replace('/dashboard')
          } else {
            // Even if user is empty, try to continue with dashboard
            if (data && Object.keys(data).length > 0) {
              setStatus('success')
              window.location.replace('/dashboard')
            } else if (retries < maxRetries) {
              retryTimer = setTimeout(fetchProfileWithRetry, 1000)
            } else {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setStatus('error')
              navigate('/login')
            }
          }
        })
        .catch(error => {
          if (retries < maxRetries) {
            retryTimer = setTimeout(fetchProfileWithRetry, 1500)
          } else {
            // Even if profile API fails after retries, try to redirect to dashboard
            setStatus('success')
            window.location.replace('/dashboard')
          }
        })
    }

    // Start the retry process after a delay
    retryTimer = setTimeout(fetchProfileWithRetry, 800)

    return () => {
      if (retryTimer) {
        clearTimeout(retryTimer)
      }
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">
          {status === 'loading'
            ? 'Signing you in...'
            : status === 'success'
              ? 'Redirecting to dashboard...'
              : 'Something went wrong...'}
        </p>
      </div>
    </div>
  )
}

export default GoogleCallback
