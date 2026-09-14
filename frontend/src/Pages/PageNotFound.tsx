import { useNavigate } from "react-router-dom";


function NotFoundPage(){
    let navigate = useNavigate(); 
    const toLoginPage = () =>{ 
        let path = `/`; 
        navigate(path);
    }
    return(

        <div>
            Page Not Found
            <button
                className="border-2 bg-emerald-700 p-2 rounded-lg text-white hover:cursor-pointer"
                onClick={toLoginPage}            
            >

                Go to login 
            </button>
            
        </div>
    )
}

export default NotFoundPage;