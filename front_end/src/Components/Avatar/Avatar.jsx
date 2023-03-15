import React from 'react'

const Avatar = ({username,notify}) => {
  return (
    <div className="app__chat-left-user-avatar">
        <p>{username && username[0]}</p>
        <div
         style={{
          backgroundColor:notify=='admin'?'':'rgb(81, 127, 12)',
          border:notify=='admin'?'':'1px solid white'

          }} >
          {notify == 0 ||'admin' ? '':notify}
          </div>
    </div>
  )
}

export default Avatar