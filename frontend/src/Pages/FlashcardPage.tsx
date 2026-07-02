
{/*
 prev 2 weeks:
  -displayed flipcard with 1 front and back
  -made flip animation
  -made buttons to click to different flip cards (no limit to # of times a button can be incremented/decremented)

 6/29:
  - Modified flipcard to handle multiple flip cards:
    - Created a flipcard component
    - Created a mapping function to turn mock data into actual flipcards
    - Note: can't destructure a prop like in React JS, must use interface to define destructured member variables 
  - Drafted some mock data to display with small sample text
  - limited amount that prev and next button can increment/decrement
 
  6/30:
   -Remade mock data with larger sample texts
   -Added margins and wrap-break-word to prevent overflowing text
   Note: that wrap-anywhere is best to break words onto new lines if the prev line can't fit it, and as a last resort break really long words into different lines to prevent overflowing text
          also note that break-all will just separate words into different lines and not try to make it fit into a new line, so it didn't help
          Reference video: https://www.youtube.com/watch?v=6m3ZmlgfZlA
          Reddit: https://www.reddit.com/r/css/comments/17vy5zd/how_to_use_breakword_by_default_and_then_breakall/
    
 Future work:
  - Refactor buttons to  be center-align with flipcard, reduce display that show index value of flipcard
  - Refactor size of flipcard
  - Nav bar
  - New background color?
 */}

import {useState} from 'react'
export default function CardDisplayPage() {
    return <CardDisplay/>
}

{/* defining prop type to pass into FlipCardComponent*/}
interface FlipCardObject {
    key: string;
    frontContent: string;
    backContent: string;
};

    
 
{/*Mock data to simulate multiple data being passed from creation page*/}
const md: FlipCardObject[] = [{frontContent: 'front! finally got ts to work gng, I fr feel like a god writing whatever i want on here u herd?', backContent: 'back as in backshots? lmk and hmu u feel?',key:'1'},
                              {frontContent: 'wassup', backContent: 'nothing much, wbu? email me at skibiddiToilet6967@gmail123.com to write about ur day :)',key:'2'},
                              {frontContent:'PLEASE SPEED I NEED THIS', backContent:'MY MOM IS KINDA HOMELESS',key:'3'}];


{/*Generate a flip card from given front and back data */}
function FlipCardComponent({frontContent, backContent}: FlipCardObject){
     const[isFlipped, setIsFlipped] = useState(false);
     return (
        <div className={` h-80 w-70 cursor-pointer  rounded-lg justify-center items-center flex flex-col
                                ${isFlipped? "bg-red-500": "bg-blue-500" }
                                transition-transform duration-400 ${isFlipped? " transform-[rotateY(180deg)]":""}`}              
                    onClick={()=>{setIsFlipped(!isFlipped)}}> 

                        {/*card-content */}

                        {!isFlipped ? 
                            // Front side of card
                            <div className="text-center text-bold text-white text-xl m-2 w-5/6 wrap-anywhere " >
                                {frontContent}
                            </div> 
                            
                            : 
                            
                            // Back side of card
                            <div className= "text-center text-bold text-white text-xl transform-[rotateY(180deg)] m-2 wrap-anywhere">
                                {backContent}
                            </div>

                        }
        </div>
    );
}

function CardDisplay() {
    const[count,setCount] = useState(1);
    const FlipCardsArr = md.map((FlipCard) => {
        return (
            <FlipCardComponent
                key={crypto.randomUUID()}
                frontContent={FlipCard.frontContent} 
                backContent={FlipCard.backContent}/>
                
        );
    });

    const totalFlipCards = FlipCardsArr.length;

    return (
        <div className=" flex flex-col fmin-h-screen justify-center items-center ">
            { /*card*/}
            {FlipCardsArr[count-1]}
           
            {/* button container */}
            <div className="flex flex-row justify-between w-1/6">
                
                {/*Left arrow container */}
                <div onClick={()=>{setCount(count != 1 ? count=>count-1: count=>count)}}>

                    {/*Left arrow symbol */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5} 
                        stroke="currentColor"
                        className="size-8 bg-gray-400 rounded-lg text-white cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </div>

                <div className="bg-gray-400 text-bold text-white text-xl rounded-lg px-4 py-0.75"
                >{count + " / " + totalFlipCards}</div>

                 {/*Right arrow container*/}
                <div onClick={()=>{setCount(count < totalFlipCards ? count=> count+1 : count=>count)}}>
                    {/*Right arrow symbol */}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="size-8 bg-gray-400 rounded-lg text-white cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </div>
                
            </div>
            
        </div>

    );
}

