// import { useEffect, useState } from "react";
import BadgeList from "./BadgeList";
import BookMark from "./BookMark"
import MissionList from "./MissionList";
// import BookStack from "./BookStack"
import MyReviewSection from "./MyReviewSection";
import Progress from "./Progress"
import WordCloud from "./WordCloud";

function Library() {



    return(
    <div className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[1200px] mt-28 px-4">
            <Progress/>
           
            <BookMark/>
            <hr className="w-full max-w-[1100px] mx-auto my-18 border-t-1.5 border-[var(--color-primary-black)]" />
            <WordCloud/>
            <hr className="w-full max-w-[1100px] mx-auto my-18 border-t-1.5 border-[var(--color-primary-black)]" />

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="">
                     <BadgeList/>

                    <MissionList/>
            
                </div>

            <MyReviewSection />                
            </div>

        </div>

    </div>
        
    )
}






export default Library