import React from 'react'

import {useState} from 'react'
import {useNavigate} from "react-router";
import {supabase} from '../supabase'

export default function LoginPage() {
  return <Login/>;
}

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(){
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
    <div>
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-3xl font-bold">Log into FlashLearn</h1>

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

        {/* log in button */}
        <div>
          <button 
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>

        {/* forget password button */}
        <div>
          <button 
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
            onClick={forgetPassword}
          >
            Forget Password?
          </button>
        </div>

        {/* create new account button */}
        <div>
          <button 
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
            onClick={signUp}
          >
            Create new account
          </button>
        </div>
      </div>
    </div>
  )
}