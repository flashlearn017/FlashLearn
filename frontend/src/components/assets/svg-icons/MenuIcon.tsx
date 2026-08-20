
interface MenuIconProp{
    style?: string;
    handleClick?: VoidFunction;
}

function MenuIcon({style, handleClick}: MenuIconProp) {
    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            onClick={handleClick}
            className={typeof style === 'undefined'? "": style}
            fill="#e3e3e3">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
    );
}

export default MenuIcon;