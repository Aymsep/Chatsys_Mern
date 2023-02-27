import React,{useState,useEffect} from 'react'
import './Chat.scss'
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import {AiFillMessage} from 'react-icons/ai'
import Avatar from '../Avatar/Avatar'

const Chat = ({username}) => {
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
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
  return (
    <div className="app__chat-container">
        <div className="app__chat-left">
            <div className="app__chat-left-brand">
                <AiFillMessage/>
                <h1>ChatTogether</h1>
            </div>
            {
                Object.keys(onlineUsers).map((fullname,i) =>(
                    <div key={i} className="app__chat-left-user" >
                        <Avatar username={onlineUsers[fullname]}/>
                        {onlineUsers[fullname]}
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