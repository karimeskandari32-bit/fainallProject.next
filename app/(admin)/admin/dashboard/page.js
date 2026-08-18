"use client"

import { useAuth } from "@/authContet/authContext"

export default function Dashboard(){
   const {logout}=useAuth()

    
    return(
       <>
        <h1>admin</h1>
        <button onClick={logout}>logout</button>
        
       </>

    )

}