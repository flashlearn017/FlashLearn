import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toolbar from "../components/toolbar";
import { supabase } from "../supabase"

export default function TestHomePage() {
    return <Home />
}

function Home() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);

    useEffect(() => {
        //displaying all the tests the user has made 
        async function fetchTest() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if(!user){
                return;
            }

            const { data, error } = await supabase
                .from("Test")
                .select("*")
                .eq("user_id", user.id)

            if (error) {
                console.log(error)
                return
            }

            setTests(data)
        }

        fetchTest()
    }, [])

    async function deleteTest(testId: string) {
        const confirmDelete = window.confirm("Are you sure you want to delete this test? Action cannot be undone.")

        if(!confirmDelete){
            return;
        }

        const {error} = await supabase
            .from("Test")
            .delete()
            .eq("id", testId)

        if(error){
            console.log(error);
            return;
        }

        setTests(tests.filter((test) => test.id != testId))
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <Toolbar />
            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Practice</p>
                        <h1 className="mt-1 text-3xl font-bold">Tests</h1>
                        <p className="mt-2 text-sm text-slate-600">Create tests from flashcards, edit them, or delete old versions.</p>
                    </div>
                    <button className="rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800" onClick={() => navigate("/create-test")}>
                        Create test
                    </button>
                </div>

                <section className="mt-6 grid gap-4 md:grid-cols-2">
                    {tests.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center md:col-span-2">
                            <h2 className="text-xl font-semibold">No tests yet</h2>
                            <p className="mt-2 text-slate-600">Create a test from your flashcards to start practicing.</p>
                            <button className="mt-4 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800" onClick={() => navigate("/create-test")}>
                                Create test
                            </button>
                        </div>
                    ) : tests.map((test) => (
                        <article key={test.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{test.name}</h2>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {test.questions?.length} {test.questions?.length > 1? "questions" : "question"} {test.timedTest? `- ${test.testTime} ${test.testTime > 1? "minutes" : "minute"}` : ''}
                                    </p>
                                </div>
                                <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                    Saved
                                </span>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link to={`/test/${test.id}`} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                                    Start
                                </Link>
                                <Link to={`/edit-test/${test.id}`} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                                    Edit
                                </Link>
                                <button type="button" onClick={() => deleteTest(test.id)} className="rounded-md border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    )
}
