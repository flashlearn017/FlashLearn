import { supabase } from "../supabase"
import { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRouter() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  if (loading) return null

  return session ? <Outlet /> : <Navigate to="/" replace />
}