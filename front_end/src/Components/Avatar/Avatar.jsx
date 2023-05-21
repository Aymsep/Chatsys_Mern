import React,{useEffect} from 'react'


const Avatar = ({image,username,notify}) => {
  console.log('avatar',image)
  return (
    <div className="app__chat-left-user-avatar" style={{backgroundImage:`url(http://localhost:3005/images/${image})`}}>
        {/* <div src={`http://localhost:3005/images/${image}`} alt="" /> */}
        <div ></div>
        <div
         style={{
          backgroundColor:notify=='admin'?'':'rgb(81, 127, 12)',
          border:notify=='admin'?'':'1px solid white'

          }} >
          {notify == 0 ? '':notify=='admin'?'':notify}
          </div>
    </div>
  )
}

export default Avatar