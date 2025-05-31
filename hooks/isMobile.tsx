"use client"

import { useEffect, useState } from "react"


export const useIsMobile = () =>{
    const [isMobile, setisMobile] = useState(window.innerWidth < 1024);

     useEffect(() => {
        if(window){
            setisMobile(window.innerWidth < 1024)
        }
     }, []);

     return {isMobile}

}