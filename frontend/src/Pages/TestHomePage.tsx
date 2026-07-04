import {useNavigate} from 'react-router'

import Toolbar from "../components/toolbar"

export default function TestHomePage(){
    return <Home/>
}

function Home(){
    const navigate = useNavigate();
    return(
        <div>
            <Toolbar/>
            <div className="my-20"></div>
            <div className="text-5xl flex justify-center"> What would you like to do today? </div>
            <div className="my-40"></div>
            <div className="flex justify-center my-10">
                <button className="text-5xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400" 
                onClick={()=> navigate("/create-test")}>
                    Create Test 
                </button>
            </div>
            <div className="flex justify-center">
                <button className="text-5xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400"
                onClick={()=> navigate("/test")}> 
                    View Old Test(s)
                </button>
            </div>
        </div>
    )
}