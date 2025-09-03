// import { useEffect, useState } from "react";
import BookMark from "./BookMark"
// import BookStack from "./BookStack"
import MyReviewSection from "./MyReviewSection";
import Progress from "./Progress"

function Library() {

//   const books = [
//     { book_id: 1, book_name: "책 1", image_url: "https://picsum.photos/200/300?1" },
//     { book_id: 2, book_name: "책 2", image_url: "https://picsum.photos/200/300?2" },
//     { book_id: 3, book_name: "책 3", image_url: "https://picsum.photos/200/300?3" },
//   ];




    return(
    <div className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[1200px] mt-28 px-4">
            <Progress/>
            <BookMark/>

            <hr className="w-full max-w-[1100px] mx-auto my-18 border-t-1.5 border-[var(--color-primary-black)]" />


            <MyReviewSection />

            {/* <BookStack books = {books} /> */}




        </div>

    </div>
        
    )
}






export default Library