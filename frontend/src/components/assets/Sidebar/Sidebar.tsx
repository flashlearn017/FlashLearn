
import MenuIcon from "../svg-icons/MenuIcon";
import HomeIcon from "../svg-icons/HomeIcon";
import FlashcardIcon from "../svg-icons/FlashcardIcon";
import LogoutIcon from "../svg-icons/LogoutIcon";
import SidebarItem from "./SidebarItem";
import { useState } from "react";

const hoverVariants = {
    primary: 'hover: bg-purple-800 hover: text-white'
}

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return(

        <aside className={`bg-purple-950 ${isCollapsed ? 'w-13 overflow-hidden': 'w-60' } duration-200 ease-in-out `}>

           <ul className='flex flex-col text-white list-none sticky top-0 '>
                    <SidebarItem
                        icon={<MenuIcon style="shrink-0" handleClick={()=>{setIsCollapsed(!isCollapsed)}} /> }
                        text="FlashLearn"
                        
                    />

                  
                    <SidebarItem
                        link="/home"
                        icon= {<HomeIcon style="shrink-0"/>}
                        text="Home"
         
                     />

                     <SidebarItem
                        link="/flashcard"
                        icon= {<FlashcardIcon style="shrink-0"/>}
                        text="Flashcards"
              

                    />

                     {/* Todo: Sign out from acc*/}
                    <SidebarItem
                        link="/"
                        icon= {<LogoutIcon style="shrink-0" />}
                        text="Logout"
                    />

            </ul>

        </aside>
    );    
}

export default Sidebar;
