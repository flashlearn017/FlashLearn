import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  async function handleCreateAccount() {
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
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-3xl font-bold">FlashLearn</h1>
        <h2 className="text-xl">Create a New Account</h2>

        {/* email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-2xl"
          />
        </div>

        {/* password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-2xl"
          />
        </div>

        {/* confirm password */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-2xl"
          />
        </div>

        {/* error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* success message */}
        {success && <p className="text-green-600">{success}</p>}

        {/* create account button */}
        <div>
          <button
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400 disabled:opacity-50"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}