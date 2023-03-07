import React,{useState,useEffect, useRef} from 'react'
import './Chat.scss'
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import Avatar from '../Avatar/Avatar'
import Logo from '../Logo/Logo'



const Chat = ({username,id}) => {
    const scroll = document.getElementById('scroll-message')
    

    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [message, setMessage] = useState([])
    const [currentID, setCurrentID] = useState(id)
    const scroll_ref =useRef(null)
    let tkn = localStorage.getItem('token')
    useEffect(()=>{
        if(scroll_ref.current){
            let d = scroll_ref.current
            d.scrollTop = d.scrollHeight;
        }
    },[message])
    
    function connectsocket(){
        const ws = new WebSocket('ws://localhost:3005')
        setWs(ws)
        ws.addEventListener('message', handleMessage)
        ws.addEventListener('close', ()=> connectsocket())
    }
    useEffect(()=>{
        fetch('http://localhost:3005',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body:JSON.stringify({
                tkn
            })
        })
        connectsocket()
       

    },[])
    function showOnlineUsers(onlineUsers){
        const users = {}
        onlineUsers.forEach(({userId,fullname}) => {
            users[userId] = fullname
        })
        setOnlineUsers(users)
    }
    function handleMessage(e){
        const msg = JSON.parse(e.data)
        if('online' in msg){
            showOnlineUsers(msg.online)
        }else{
            setMessage((prev=>[...prev,
                {
                    text:msg.msg,
                    isOur:false
                }
            ]))
            setCurrentID(msg.sendr && msg.sendr)
        }
    }
    function PressMessage(e){
       if(e.key === 'Enter'){
        e.preventDefault()
        setNewMessage('')
        ws.send(JSON.stringify({
                sender:id,
                receiver:selectedUser,
                text:newMessage
        }))
        setMessage((prev=>[...prev,
            {
            text:newMessage,
            isOur:true,
            sender:id,
        }
        ]))
        setCurrentID(id)
    }
}
    function SendMessage(e){
        
        e.preventDefault()
        setNewMessage('')
        ws.send(JSON.stringify({
                sender:id,
                receiver:selectedUser,
                text:newMessage
        }))
        setMessage((prev=>[...prev,
            {
            text:newMessage,
            isOur:true,
            sender:id,
        }
        ]))
        setCurrentID(id)

    }

    const onlineUsersExceptLogged = {...onlineUsers}
    delete onlineUsersExceptLogged[id]

    useEffect(()=>{
        if(selectedUser){
            fetch(`http://localhost:3005/message/${selectedUser}`)
            .then(res=>res.json())
            .then(res=>{
                console.log(res)
            })
        }else{
            console.log('nothing selected')
        }
    },[selectedUser])

  return (
    <div className="app__chat-container">
        <div className="app__chat-left">
           <Logo/>
            {
                Object.keys(onlineUsersExceptLogged).map((userID,i) =>(
                    <div onClick={() => setSelectedUser(userID)} key={i} className={`app__chat-left-user ${userID==selectedUser?'app__chat-left-user-selected':''} `} >
                        <Avatar username={onlineUsers[userID]}/>
                        <p>{onlineUsers[userID]}</p>
                        </div>
                ))
            }
        </div>
        <div className="app__chat-right">
            {
                selectedUser && (
                    <div className="app__chat-right-contact">
                        <Avatar username={onlineUsers[selectedUser]}/>
                         <h3>{onlineUsersExceptLogged[selectedUser]}</h3>
                        </div>
                )
            }
                {
                    !!selectedUser && (
                        <div ref={scroll_ref}    id='scroll-message' className='app__chat-right-area'>
                        {message && message.map((msg,i)=>(
                            <div id="scroll-message" key={i}  className={`app__chat-right-message ${msg.sender == id?'app__chat-right-message-current':'app__chat-right-message-receiver'  }`}>
                                    <p>{msg.text}</p>
                                    {/* <div id="refe" ref={scroll_ref}></div> */}
                                </div>
                                ))}
                                </div>
                    )
                }
            {
                selectedUser && (
                    <>
                    <div className="app__chat-right-inside">
                        <input 
                        onKeyDown={(e)=>PressMessage(e)}
                        value={newMessage}
                        onChange={(e)=>setNewMessage(e.target.value)}
                        type="text" 
                        placeholder='Type your message here' />
                        <MdOutlineArrowForwardIos onClick={e=>SendMessage(e)}/>
                    </div>
                    </>
                    
                )
            }
            {
                !selectedUser && (
                    <div className="app__chat-right-center">
                        <h2>&larr; Select a person from sidebar</h2>
                    </div>
                )
            }
            

        </div>
    </div>
  )
}

export default Chat