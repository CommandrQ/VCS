import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // 1. Check if a user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // 3. If logged in, fetch their Role from the profiles table
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) setProfile(data)
  }

  // Logic Gate: If no session, show Login. If session but no profile yet, show loading.
  if (!session) return <Login />
  if (!profile) return <div className="bg-slate-900 min-h-screen text-white p-10">Loading Profile...</div>

  // If everything is clear, show the Library Dashboard
  return <Dashboard userProfile={profile} />
}

export default App
