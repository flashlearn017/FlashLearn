export default function Toolbar(){
    const links = [
        ["Home", "/home"],
        ["Flashcards", "/flashcard-home"],
        ["Test", "/test-home"],
    ]

    return (
        <div>
            <div className="max-w-full flex [&>div]:p-5 bg-black text-white">
                {links.map((i) => {
                return(
                    <a href={i[1]} className="p-5" key={i[0]}>
                        {i[0]}
                    </a>
                )
                })}
            </div>
        </div>
    )
}