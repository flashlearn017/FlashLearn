import React from 'react'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");

  function handleNext() {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    setCodeSent(true);
  }

  return (
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-3xl font-bold">FlashLearn</h1>
        <h2 className="text-xl">Forgot Password?</h2>

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

        {/* 6-digit code input — appears after Next is clicked */}
        {codeSent && (
          <div>
            <input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="text-2xl"
            />
          </div>
        )}

        {/* error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* next button */}
        <div>
          <button
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
            onClick={handleNext}
          >
            Next
          </button>
        </div>

        {/* success message — appears after Next is clicked */}
        {codeSent && (
          <p className="text-green-600">Check your email for the 6-digit code.</p>
        )}
      </div>
    </div>
  );
}