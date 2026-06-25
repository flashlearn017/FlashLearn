import Toolbar from "../components/toolbar"

export default function CreateTestPage(){
    return <Create/>
}

function Create(){
    return(
        <div>
            <Toolbar/>
            <div className="flex justify-center text-5xl my-4"> Create your test </div>
            <div className="flex justify-center items-center flex-col text-xl gap-1">
                <input
                type="text"
                placeholder="Number of questions"
                />

                <input
                type="text"
                placeholder="Will this test be timed?"
                />

                {/* If test is timed ask how much time to give then I have to add the actual questions */}
            </div>
            

        </div>
    )
}