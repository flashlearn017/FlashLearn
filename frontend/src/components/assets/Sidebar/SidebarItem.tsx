import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SidebarProp{
    link?:string;
    icon: ReactNode; // passing svg as prop object
    text?:string;
};




function SidebarItem ({icon, link, text}: SidebarProp){

    return(
        <li>
            <Link 
                to={typeof link === 'undefined'? '': link}
                className= {`flex p-[0.85rem] rounded-lg gap-[1em] hover:bg-purple-800 `} >

                    {icon}
                    <span>{text}</span>

            </ Link>
        </li>
    );
}

export default SidebarItem;