import React,{useState,useEffect} from 'react'
import './Chat.scss'
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import Avatar from '../Avatar/Avatar'
import Logo from '../Logo/Logo'

const Chat = ({username}) => {
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)



    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:3005')
        ws.addEventListener('open', ()=>{
            const token = localStorage.getItem('token')
            ws.send(token)
        })
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
            }
        }
    },[])

    function selectContact(id) {

    }

    
  return (
    <div className="app__chat-container">
        <div className="app__chat-left">
           <Logo/>
            {
                Object.keys(onlineUsers).map((userID,i) =>(
                    <div onClick={() => setSelectedUser(userID)} key={i} className={`app__chat-left-user ${userID==selectedUser?'app__chat-left-user-selected':''} `} >
                        <Avatar username={onlineUsers[userID]}/>
                        <p>{onlineUsers[userID]}</p>
                        </div>
                ))
            }
        </div>
        <div className="app__chat-right">
            <h2>Message with selected person</h2>
            <div className="app__chat-right-inside">
                <input type="text" placeholder='Type your message here' />
                <MdOutlineArrowForwardIos/>
            </div>

        </div>
    </div>
  )
}

export default Chat