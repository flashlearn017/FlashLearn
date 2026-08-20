import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/toolbar";
import { supabase } from "../supabase";

export default function ProfilePage() {
    return <Profile />;
}

function Profile() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        async function fetchUserProfileAndHistory() {
            const { data: { user } } = await supabase.auth.getUser();

            setUserEmail(user.email);

            const { data, error } = await supabase
                .from("Test_Results")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.log(error);
                return;
            }
            
            setResults(data || []);
            setLoading(false);
        }

        fetchUserProfileAndHistory();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-950">
                <Toolbar />
                <div className="flex justify-center items-center min-h-screen text-2xl animate-pulse text-slate-500">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 pb-20">
            <Toolbar />
            <main className="mx-auto max-w-4xl px-4 py-8">
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold">
                        {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-slate-500 mt-1">{userEmail}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Test History</h2>
                    
                    {results.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <h3 className="text-lg font-semibold text-slate-700">No test taken yet</h3>
                            <p className="mt-2 text-slate-500">When you complete a test, your score will appear here.</p>
                            <button 
                                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition-all" 
                                onClick={() => navigate("/test-home")}
                            >
                                Take a Test
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <ul className="divide-y divide-slate-100">
                                {results.map((result) => (
                                    <li key={result.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 mb-1">
                                                {new Date(result.created_at).toLocaleDateString(undefined, { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="font-bold text-slate-800 text-lg">Test Name: {result.test_name}</p>
                                        </div>
                                        
                                        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${result.score >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                            {result.score}%
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}