import React from 'react'

const Avatar = ({username,notify}) => {
  console.log('notify : ',notify)
  return (
    <div className="app__chat-left-user-avatar">
        <p>{username && username[0]}</p>
        <div>{notify == 0? '':notify}</div>
    </div>
  )
}

export default Avatar