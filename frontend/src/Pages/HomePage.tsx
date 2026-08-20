import Toolbar from "../components/toolbar"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  return <Home/>;
}

function Home(){
    const navigate = useNavigate();

    return(
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <Toolbar/>
            <main className="mx-auto max-w-6xl px-4 py-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Dashboard</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">Welcome to FlashLearn</h1>
                    <p className="mt-2 max-w-2xl text-slate-600">
                        Create flashcard sets, practice with tests, and review your progress from one place.
                    </p>
                </section>

                <section className="mt-6 grid gap-4 md:grid-cols-2">
                    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Study</p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">Flashcards</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Build card sets and review them at your own pace.
                            </p>
                        </div>
                        <button
                            className="mt-5 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
                            onClick={() => navigate("/flashcard")}
                        >
                            Open flashcards
                        </button>
                    </article>

                    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Practice</p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900">Tests</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Create tests from your flashcards and track your scores.
                            </p>
                        </div>
                        <button
                            className="mt-5 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
                            onClick={() => navigate("/test-home")}
                        >
                            Open tests
                        </button>
                    </article>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Recent progress</h2>
                            <p className="mt-2 text-sm text-slate-600">
                                Your completed test scores are saved on your profile.
                            </p>
                        </div>
                        <button
                            className="rounded-md border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 hover:bg-slate-100"
                            onClick={() => navigate("/profile")}
                        >
                            View profile
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}
