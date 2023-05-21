import { useContext,useState } from "react";
import Form from "./Components/Form/Form";
import { Usercontext } from "./Usercontext";
import Chat from "./Components/Chat/Chat";


export default function Routes(){
    
    const {username,id,token,image} = useContext(Usercontext)
    if(token !== null){
        localStorage.setItem('token', token)
    }
    if(username){
        return <Chat username={username} id={id} image={image} />
    }
    return (
        <Form/>
    )
}