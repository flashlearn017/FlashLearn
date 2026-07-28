import Toolbar from "../components/toolbar"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  return <Home/>;
}

function Home(){
    const navigate = useNavigate();

    return(
      <div>
        <Toolbar/>
        <div className="flex items-center justify-center h-screen flex-col gap-4">
          <h1 className="text-3xl font-bold">Welcome to FlashLearn</h1>
          <p>Create flashcards and test yourself.</p>

          <button
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
            onClick={() => navigate("/flashcard-home")}
          >
            Flashcards
          </button>

          <button
            className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
            onClick={() => navigate("/test-home")}
          >
            Tests
          </button>
        </div>
      </div>
    )
}
