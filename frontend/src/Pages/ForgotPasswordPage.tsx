import {supabase} from '../supabase'
import React from 'react'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleNext() {
    // 1st time user hits next, they are sent the 6-digit code
    if (!codeSent) {
      if (!email) {
        setError("Please enter your email.");
        return;
      }
      // Calls to supabase to create a random code and send it to the user
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        // TEMP: will fix later
        setError("supabase error");
        return;
      }
      setCodeSent(true);
      return;
    }

    // 2nd time user hits next: they've already filled in the code
    if (code.length < 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    // Supabase verifies the code and authenticates the user
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery'
    });
    if (error) {
      //  TEMP: will fix later
      setError("supabase error");
      return;
    }
    setShowReset(true);
  }

  async function handleResetPassword() {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      // TEMP: will fix this later
      setError("supabase error");
      return;
    }
    setSuccess("Your password has been reset. You can now log in.");
    await supabase.auth.signOut();
  }

  if (showReset) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen flex-col gap-4">
          <h1 className="text-3xl font-bold">FlashLearn</h1>
          <h2 className="text-xl">Reset Password</h2>

          {/* new password */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-2xl"
            />
          </div>

          {/* confirm new password */}
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-2xl"
            />
          </div>

          {/* error message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* success message */}
          {success && <p className="text-green-600">{success}</p>}

          {/* reset password button */}
          <div>
            <button
              className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    );
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
