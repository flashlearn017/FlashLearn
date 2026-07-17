import { useState } from "react"
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import { supabase } from "../supabase"

async function LogOut(
    e: React.MouseEvent<HTMLAnchorElement>,
    command: string,
    setLoggingOut: React.Dispatch<React.SetStateAction<boolean>>,
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
    const links = [
        ["Home", "/home"],
        ["Flashcards", "/flashcard-home"],
        ["Test", "/test-home"],
        ["Sign Out", "/"]
    ]

    return (
        <div>
            <div className="max-w-full flex [&>div]:p-5 bg-black text-white">
                {links.map((i) => {
                return(
                    <a href={i[1]} className="p-5" key={i[0]}
                        onClick={(e) => LogOut(e, i[0], setLoggingOut, navigate)}
                    >{i[0]}</a>
                )
                })}

            </div>
        </div>
    )
}