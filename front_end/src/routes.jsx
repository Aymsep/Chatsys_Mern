import { useContext,useState } from "react";
import Form from "./Components/Form/Form";
import { Usercontext } from "./Usercontext";


export default function Routes(){
    const {username,id} = useContext(Usercontext)
    if(username){
        return `logged in`
    }
    return (
        <Form/>
    )
}