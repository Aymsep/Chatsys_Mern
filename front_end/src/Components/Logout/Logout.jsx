import React from 'react'
import './Logout.scss'
import {MdLogout} from 'react-icons/md'
import Avatar from '../Avatar/Avatar'

const Logout = ({username,image}) => {
  console.log('logout ',image)
    function logout() {
        localStorage.removeItem('token')
        window.location.reload(false);
    }
  return (
    <div className="app__logout">
        <Avatar username={username} notify='admin' image={image}   />
        <div className="labeled">
        <label>{username}</label>
        <span>Male</span>
        </div>
        <MdLogout onClick={logout} />
        {/* <button onClick={logout} ></button> */}
    </div>
  )
}

export default Logout