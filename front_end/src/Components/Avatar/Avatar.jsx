import React from 'react'

const Avatar = ({username}) => {
  return (
    <div className="app__chat-left-user-avatar">
        <p>{username && username[0]}</p>
    </div>
  )
}

export default Avatar