import type { Image } from "@google/genai";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface NavItemProp{
    link?:string;
    icon: ReactNode; // passing svg as prop object
    text?:string;
    children?: ReactNode;

};




function NavItem ({icon, link, text ,children}: NavItemProp){

    return(
        <li>
            <Link 
                to={typeof link === 'undefined'? '': link}
                className= {`flex justify-end  p-2 rounded-lg gap-[1em] `} >
                    
                    {icon}
                    <span>{text}</span>

            </ Link>
            {children}
        </li>
    );
}

export default NavItem;