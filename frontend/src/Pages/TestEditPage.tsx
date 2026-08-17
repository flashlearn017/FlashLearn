import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toolbar from "../components/toolbar";
import { supabase } from "../supabase";

export default function EditTestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [timedTest, setTimedTest] = useState(false);
    const [testTime, setTestTime] = useState(10);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchTest() {
            if (!testId){
                return;
            } 

            const { data, error } = await supabase
                .from("Test")
                .select("*")
                .eq("id", testId)
                .single();

            if (error) {
                console.error("Error fetching test:", error);
                return;
            } 
            
            setName(data.name || "");
            setTimedTest(data.timedTest || false);
            setTestTime(data.testTime || 1);
            
            setLoading(false);
        }

        fetchTest();
    }, [testId]);

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from("Test")
            .update({
                name: name,
                timedTest: timedTest,
                testTime: timedTest ? Number(testTime) : null,
            })
            .eq("id", testId);

        setSaving(false);

        if (error) {
            console.error("Error updating test:", error);
            return;
        } 
        
        navigate("/test-home");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-950">
                <Toolbar />
                <div className="flex justify-center items-center h-[60vh] text-2xl text-slate-500 animate-pulse">
                    Loading test details...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <Toolbar/>
            <main className="max-w-2xl mx-auto px-4 mt-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Manage</p>
                    <h1 className="text-3xl font-bold text-slate-900 mt-1">Edit Test</h1>
                    <p className="text-slate-600 mt-2">Update your test name or timer settings.</p>
                </div>

                <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Test Name</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="timedTest"
                            className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                            checked={timedTest}
                            onChange={(e) => setTimedTest(e.target.checked)}
                        />
                        <label htmlFor="timedTest" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Enable Timer for this test
                        </label>
                    </div>

                    {timedTest && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Time Limit (minutes)</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                value={testTime}
                                onChange={(e) => setTestTime(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-emerald-700 text-white font-semibold rounded-xl px-6 py-3 hover:bg-emerald-800 transition-all shadow-sm disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/test-home")}
                            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}