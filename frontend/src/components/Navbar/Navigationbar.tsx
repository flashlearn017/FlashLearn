
import { useState } from "react";
import ProfileIcon from "../../assets/svg-icons/ProfileIcon";
import DropdownItem from "../DropdownItem";
import LogoutIcon from "../../assets/svg-icons/LogoutIcon";
import NavItem from "./NavItem";

function Navbar(){
    const [isVisible, setIsVisible] = useState(false);
    return(

        <nav className='grid col-span-2 bg-purple-950 text-white h-15 '>
            <ul className="flex items-center justify-between "
                onClick={()=>{setIsVisible(!isVisible)}}>

                <span>{"Sample Text"}</span>
                
                
                <NavItem
                    icon={<ProfileIcon style="shrink-0" />}
                >
                
                {
                    isVisible?

                        <ul className="flex flex-col absolute top-15 right-2 z-1 bg-black rounded-xl p-2 w-50 h-40 ">

                                <DropdownItem
                                    icon={<LogoutIcon />}
                                    text="Link1"

                                />
                                <DropdownItem
                                    icon={<LogoutIcon />}
                                    text="Link2"

                                />
                                <DropdownItem
                                    icon={<LogoutIcon />}
                                    text="Link3"
                                />


                            </ul>
                        :
                            <></>
                    }

                </NavItem>
         </ul>

            
        </nav>
    );
}


export default Navbar;