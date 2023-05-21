import React,{useState,useEffect, useRef} from 'react'
import './Chat.scss'
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import {ImAttachment} from 'react-icons/im'
import {IoIosArrowDown} from 'react-icons/io'
import {AiFillPlusCircle,AiOutlineSearch,AiFillSetting,AiFillStar,AiFillMessage,AiFillCheckCircle} from 'react-icons/ai'
import Avatar from '../Avatar/Avatar'
import Logo from '../Logo/Logo'
import Logout from '../Logout/Logout'
import { Buffer } from 'buffer';
import imagee from '../../aym.png'
import beepSound from '../../audio/mixkit-correct-answer-tone-2870.wav';



const Chat = ({username,id,image}) => {
    console.log('chat',username,id,image)
    const scroll = document.getElementById('scroll-message')
    let time = new Date()
    let timeNow = `${time.getHours()}:${time.getMinutes()}`

    function GetTime(timestamp) {
            let date = new Date(timestamp && timestamp)
            const time = date.toLocaleTimeString('en-US', {timeStyle: 'short', hour12:false });
            return time
    }
    let tkn = localStorage.getItem('token')
    const [ws, setWs] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [message, setMessage] = useState([])
    const [currentID, setCurrentID] = useState(id)
    const scroll_ref =useRef(null)
    const [receivedmsg, setreceivedmsg] = useState([])
    const [imagesrc, setimagesrc] = useState()
    const [file, setFile] = useState()
    const [newMessageReceived, setNewMessageReceived] = useState(false);
    const [userimage, setuserimage] = useState(image && image)

    const [otherUserIDs, setOtherUserIDs] = useState([]);

    const [otherimg, setotherimg] = useState(null)

    
    
    const audioRef = useRef(null);
    
    useEffect(() => {
        audioRef.current = new Audio(beepSound);
        audioRef.current.volume = 0.5; // Adjust the volume if needed
        
        const playBeepSound = () => {
            audioRef.current.play();
        };
        
        if (newMessageReceived) {
            playBeepSound();
            setNewMessageReceived(false);
        }
    }, [newMessageReceived]);
    
    console.log(message)
    
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
        // ws.addEventListener('message', getf)
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
        onlineUsers.forEach(({userId,fullname,image}) => {
            users[userId] = [fullname,image]
        })
        setOnlineUsers(users)
    }
    
    function handleMessage(e){
        const msg = JSON.parse(e.data)
        if(msg.image){
            const buffer = Buffer.from(msg.image,'base64')
            console.log(buffer)
            const img = `data:image/png;base64,${msg.image}`
            setimagesrc(img);
            setMessage((prev)=>[...prev,
            {
                image:img,
                isOur:false,
            }])
            
        }
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
            setreceivedmsg((prev)=> [...prev,msg.msg])
            setNewMessageReceived(true);
        }
    }

    function PressMessage(e){
       if(e.key === 'Enter'){
        e.preventDefault()
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
            createdAt:time,
        }
    ]))
    setCurrentID(id)
    setSelectedUser(selectedUser && selectedUser)
    setNewMessage('')
    
    }
}
    function SendMessage(e){
            e.preventDefault()
            ws.send(JSON.stringify({
                    sender:id,
                    receiver:selectedUser,
                    text:newMessage,
                    // file:{
                    //     image:file?.image,
                    //     name:file?.name
                    // }
            }))
            setMessage((prev=>[...prev,
                {
                // image:message.image,
                text:newMessage ,
                isOur:true,
                sender:id,
                createdAt:time,
            }
            ]))
            setCurrentID(id)
            setNewMessage('')

    }

    const onlineUsersExceptLogged = {...onlineUsers}
    delete onlineUsersExceptLogged[id]

    useEffect(()=>{
        const response =  fetch(`http://localhost:3005/message/${selectedUser}`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')===null?null:localStorage.getItem('token')}`
              }
        }).then(res=>res.json())
        .then(res=>{
            setMessage(res)
        })
        setreceivedmsg([])
    },[selectedUser])

    function removeselected(e){
        if(e.target == e.currentTarget){
            setSelectedUser(null)
        }
    }

    function selectFile(e){
        const reader = new FileReader()
        reader.readAsDataURL(e.target?.files[0])
        reader.onload = () => {
            const image = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
            setFile({
                image:image,
                name:e.target.files[0].name
            })
        }
    }
    useEffect(() => {
        if (onlineUsers) {
          const filteredIDs = Object.keys(onlineUsers).filter((userID) => userID !== currentID);
          setOtherUserIDs(filteredIDs);
        }
      }, [onlineUsers, currentID]);

    // useEffect(() => {
    //     const filteredIDs = Object.keys(onlineUsersExceptLogged).filter(
    //       (userID) => userID !== currentID
    //     );
    //     setOtherUserIDs(filteredIDs);
    //     console.log(otherUserIDs)
    //   },[]);

  return (
    <div className="app__chat-container">
        <div className="app__new">
            <div className="new-image">
                    <img src={`http://localhost:3005/images/${image}`} alt=""/>
            </div>
            <div className="hover-link-container">
                <a href="#" className="hover-link">
                    {username}
                    <IoIosArrowDown/>
                </a>
            <div className="hover-content">Logout</div>
    </div>
            <a href="#" className="new-plus sv">
                <AiFillPlusCircle/>
            </a>

            <a href="#" className="new-msg check-msg sv">
                <AiFillMessage/>
            </a>

            <a href="#" className="new-check sv">
                <AiFillCheckCircle/>
                
            </a>

            <a href="#" className="new-star sv">
                <AiFillStar/>
            </a>

            <a href="#" className="new-setting sv">
                <AiFillSetting/>
            </a>

        </div>
        <div className="app__chat-left" onClick={(e) =>removeselected(e)}>
            <div className="search-input">
                <AiOutlineSearch/>
                <input type="text" placeholder='Search For User' />
            </div>
           
           {
                Object.keys(onlineUsersExceptLogged).map((userID, i) => {
                    const userImage = onlineUsers[userID][1];
                    const userName = onlineUsers[userID][0];
                    return (
                    <div
                        onClick={() => setSelectedUser(userID)}
                        key={i}
                        className={`app__chat-left-user ${
                        userID === selectedUser ? "app__chat-left-user-selected" : ""
                        }`}
                    >
                        <div className="left-user-image">
                                <Avatar notify={selectedUser ? "" : receivedmsg.length} image={userImage} />
                        </div>
                        <div className="left-user-info">
                            <h2>{userName}</h2>
                            <p>text lorem</p>
                        </div>
                    </div>
                    );
                })
        }
        </div>
        
        <div className="app__chat-right">
            {
                selectedUser && (
                    <div className="app__chat-right-contact">
                        <Avatar username={onlineUsers[selectedUser]} image={onlineUsers[selectedUser][1]}   />
                         <h3>{onlineUsersExceptLogged[selectedUser][0]}</h3>
                        </div>
                )
            }
                {
                    !!selectedUser  && (
                        <div ref={scroll_ref}    id='scroll-message' className='app__chat-right-area'>
                        {message && message.map((msg,i)=>{
                            return(
                            <div id="scroll-message" key={i}  className={`app__chat-right-message ${msg.sender == id?'app__chat-right-message-current':'app__chat-right-message-receiver'  }`}>
                                    <p>{msg.text}</p>
                                    <span className='app__chat-right-message-time'>{ timeNow || GetTime(msg.createdAt)}</span>
                                    {/* <img src={imagesrc} alt=""  width={75} height={75}/> */}
                                </div>
                            )
                                })}
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
                        <div className="app__chat-right-inside-svg">
                        <label htmlFor="file_inp">
                            <ImAttachment/>
                        </label>

                        <input className='hidden' type="file" id='file_inp'  onChange={(e)=>selectFile(e)}/>

                        <MdOutlineArrowForwardIos onClick={e=>SendMessage(e)}/>
                        </div>
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
            {selectedUser && <audio ref={audioRef} src={beepSound} />}
            
        </div>
    </div>
  )
}

export default Chat