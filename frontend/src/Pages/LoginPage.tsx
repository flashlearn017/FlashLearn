import React from 'react'

import {useState} from 'react'
import { Link, useNavigate} from "react-router";
import {supabase} from '../supabase'

export default function LoginPage() {
  return <Login/>;
}

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    const {error} =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      alert(error.message)
      return
    }

    console.log("Logged in")

    navigate("/home");
  }

  function forgetPassword(){
    navigate("/forgot-password");
  }

  async function signUp(){
    navigate("/create-account");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">FlashLearn</p>
        <h1 className="mt-2 text-3xl font-bold">Log in</h1>
        <p className="mt-2 text-slate-600">Continue to your flashcards and practice tests.</p>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        {error && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

        <button type="submit" disabled={loading} className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="font-medium text-emerald-800 hover:text-emerald-950">
            Forgot password?
          </Link>
          <Link to="/create-account" className="font-medium text-emerald-800 hover:text-emerald-950">
            Create account
          </Link>
        </div>
      </form>
    </main>
  )
}