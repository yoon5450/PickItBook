import BookMark from "./BookMark"
import Progress from "./Progress"

function Library() {






    return(
    <div className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[1200px] mt-28 px-4">
            <Progress/>
            <BookMark/>

            <hr className="w-full max-w-[1100px] mx-auto my-18 border-t-1.5 border-[var(--color-primary-black)]" />
        </div>

    </div>
        
    )
}






export default Library