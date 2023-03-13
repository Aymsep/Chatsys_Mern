import React from 'react'
import './Logout.scss'
import {FiUser} from 'react-icons/fi'

const Logout = ({username}) => {
    function logout() {
        localStorage.removeItem('token')
        window.location.reload(false);
    }
  return (
    <div className="app__logout">
        <FiUser/>
        {username}
        <button onClick={logout} >Logout</button>
    </div>
  )
}

export default Logout