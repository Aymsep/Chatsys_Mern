import React,{createContext,useState,useEffect} from 'react'


export const Usercontext = createContext({})


export function UserProvider({children}){
    const [username, setusername] = useState(null)
    const [id,setid] = useState(null)
    const [token, setToken] = useState(null)
    useEffect(()=>{ 
        fetch("http://localhost:3005/profile",
        {
            withCredentials:'include',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')===null?null:localStorage.getItem('token')}`
            }
        },
        )
        .then(res=>res.json())
        .then(data =>{
            setid(data.userId);
            setusername(data.fullname);
        })
    },[])


    return (
    <Usercontext.Provider value={{setToken,token,username,setusername,id,setid}} >
        {children}
    </Usercontext.Provider> 
    )


}