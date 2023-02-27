import { useContext,useState } from "react";
import Form from "./Components/Form/Form";
import { Usercontext } from "./Usercontext";


export default function Routes(){
    
    const {username,id,token} = useContext(Usercontext)
    if(token !== null){
        localStorage.setItem('token', token)
    }
    if(username){
        return `logged in ${username}`
    }
    return (
        <Form/>
    )
}