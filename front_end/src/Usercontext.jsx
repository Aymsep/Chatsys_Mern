import React,{createContext,useState,useEffect} from 'react'


export const Usercontext = createContext({})


export function UserProvider({children}){
    const [username, setusername] = useState(null)
    const [id,setid] = useState(null)
    useEffect(()=>{ 
        fetch("http://localhost:3005/profile")
        .then(res=>res.json())
        .then(data =>{
            console.log('token : ',data)
        })
    },[])


    return (
    <Usercontext.Provider value={{username,setusername,id,setid}} >
        {children}
    </Usercontext.Provider> 
    )


}