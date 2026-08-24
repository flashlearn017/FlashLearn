import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from "../supabase"

export default function CreateNewAccountPage() {
  return <CreateNewAccount />;
}

function CreateNewAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCreateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      navigate("/home");
    } else {
      setSuccess("Account created! Please check your email for a confirmation link.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <form onSubmit={handleCreateAccount} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">FlashLearn</p>
        <h1 className="mt-2 text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-slate-600">Start saving decks, cards, and practice tests.</p>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-700">Confirm password</span>
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>

        {error && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
        {success && <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}

        <button type="submit" disabled={loading} className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Creating..." : "Create account"}
        </button>

        <Link to="/" className="mt-5 block text-center text-sm font-medium text-emerald-800 hover:text-emerald-950">
          Back to login
        </Link>
      </form>
    </main>
  );
}