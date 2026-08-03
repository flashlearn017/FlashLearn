

import { useState, type ReactNode } from "react";



interface DropdownProp{
    icon?: ReactNode;
    text: string;


}
function DropdownItem({icon,text}: DropdownProp){
    return(
        <div className={`flex flex-row p-[0.85rem] rounded-lg gap-[1em] hover:cursor-pointer  `}>
            {icon}
            <span> {text} </span>

        </div>
    );
}

export default DropdownItem;