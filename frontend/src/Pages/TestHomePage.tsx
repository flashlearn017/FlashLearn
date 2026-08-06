import {useNavigate} from 'react-router'

import Toolbar from "../components/toolbar"

export default function TestHomePage(){
    return (
        <div>
            <Toolbar/>
            <Home/>
        </div>
    )
}

function Home(){
    const navigate = useNavigate();
    return(
        <div className="min-h-screen flex flex-col items-center justify-center gap-5">
            <div className="text-4xl"> What would you like to do today? </div>
            <div>
                <button className="text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400" 
                onClick={()=> navigate("/create-test")}>
                    Create Test 
                </button>
            </div>
            <div>
                <button className="text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400"
                onClick={()=> navigate("/test")}> 
                    View Old Test(s)
                </button>
            </div>
        </div>
    )
}