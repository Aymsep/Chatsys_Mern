import React,{useState,useEffect} from 'react'
import './Chat.scss'
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import Avatar from '../Avatar/Avatar'
import Logo from '../Logo/Logo'



const Chat = ({username,id}) => {
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [message, setMessage] = useState([])
    const [currentID, setCurrentID] = useState(id)
    let tkn = localStorage.getItem('token')
    
    useEffect(()=>{
        fetch('http://localhost:3005',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body:JSON.stringify({
                tkn
            })

        })


        const ws = new WebSocket('ws://localhost:3005')
        setWs(ws)
        ws.addEventListener('message', handleMessage)
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
    },[])
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

    console.log(`availble id :`,currentID )
    console.log('my id : ',id)
    console.log(message)
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
                    {onlineUsersExceptLogged[selectedUser]}
                        </div>
                )
            }
                {
                    !!selectedUser && (
                        <div className="">
                        {message && message.map((msg,i)=>(
                                <div key={i}  className={`${msg.sender == id?'app__chat-right-message':'app__chat-right-message-blue'  }`}>
                                    <p>{msg.text}</p>
                                    <p>{msg.sender}</p>
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