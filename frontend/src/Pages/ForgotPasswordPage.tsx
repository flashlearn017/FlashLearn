import { supabase } from '../supabase'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSupabaseError(error: { message: string } | null): boolean {
    if (!error) return false;
    setError(error.message);
    return true;
  }

  async function handleNext(event: FormEvent) {
    event.preventDefault();
    setError("");

    // 1st time user hits next, they are sent the 6-digit code
    if (!codeSent) {
      if (!email) {
        setError("Please enter your email.");
        return;
      }
      setLoading(true);
      // Calls to supabase to create a random code and send it to the user
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      setLoading(false);
      if (handleSupabaseError(error)) return;
      setCodeSent(true);
      return;
    }

    // 2nd time user hits next: they've already filled in the code
    if (code.length < 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);
    // Supabase verifies the code and authenticates the user
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery'
    });
    setLoading(false);
    if (handleSupabaseError(error)) return;
    setShowReset(true);
  }

  async function handleResetPassword(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    setLoading(false);

    if (handleSupabaseError(error)) return;

    // User has succeeded at resetting their password
    // Routing them back to LoginPage.tsx in 3 sec
    await supabase.auth.signOut();
    let curr = 3;
    let intervalID = setInterval(() => {
      // Displays count to user
      setSuccess(`Your password has been reset. Redirecting to login in ${curr}`);
      curr = curr - 1;
      if (curr < 0) {
        // clears the interval and
        // routes user back to login
        clearInterval(intervalID);
        navigate('/');
      }
    }, 1000);
  }

  if (showReset) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
        <form onSubmit={handleResetPassword} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">FlashLearn</p>
          <h1 className="mt-2 text-3xl font-bold">Reset password</h1>
          <p className="mt-2 text-slate-600">Choose a new password for your account.</p>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-slate-700">New password</span>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">Confirm new password</span>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          {error && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
          {success && <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</p>}

          <button type="submit" disabled={loading} className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <form onSubmit={handleNext} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">FlashLearn</p>
        <h1 className="mt-2 text-3xl font-bold">Forgot password</h1>
        <p className="mt-2 text-slate-600">Send a reset code to the email on your account.</p>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        {/* 6-digit code input — appears after Next is clicked */}
        {codeSent && (
          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">6-digit code</span>
            <input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        )}

        {error && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

        {/* success message — appears after Next is clicked */}
        {codeSent && (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Check your email for the 6-digit code.
          </p>
        )}

        <button type="submit" disabled={loading} className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Sending..." : "Next"}
        </button>

        <Link to="/" className="mt-5 block text-center text-sm font-medium text-emerald-800 hover:text-emerald-950">
          Back to login
        </Link>
      </form>
    </main>
  );
}
