import { useState, type MouseEvent, type Dispatch, type SetStateAction} from "react"
import { Link, useNavigate, useLocation, type NavigateFunction } from 'react-router-dom'
import { supabase } from "../supabase"

import logo from "../components/images/logo.png"

async function LogOut(
    e: MouseEvent<HTMLAnchorElement>,
    command: string,
    setLoggingOut: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction,
) {
    if (command != "Sign Out") { return; }
    e.preventDefault();
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    navigate("/");
}

export default function Toolbar(){
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const links = [
        ["Home", "/home"],
        ["Flashcards", "/flashcard"],
        ["Test", "/test-home"],
        ["Sign Out", "/"]
    ]

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-gray-300/95 shadow-sm backdrop-blur">
            <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/home" className="flex items-center hover:opacity-80 transition-opacity">
                    <img
                        src={logo}
                        className="h-10 w-auto"
                        alt="Flashlearn Logo"
                    />
                </Link>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                    {links.map((i) => {
                        const isActive = location.pathname == i[1]
                        const isSignOut = i[0] == "Sign Out"

                    return(
                        <a 
                            href={i[1]} 
                            key={i[0]}
                                onClick={(e) => LogOut(e, i[0], setLoggingOut, navigate)}
                                className={
                                    isSignOut 
                                        ? "ml-auto rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 sm:ml-0"
                                        : `rounded-md px-5 py-2 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-emerald-100 text-emerald-900"
                                                : "text-slate-700 hover:bg-slate-100"
                                          }`
                                }
                            >
                                {i[0]}
                            </a>
                        )
                    })}
                </div>
            </nav>
        </header>
    )
}