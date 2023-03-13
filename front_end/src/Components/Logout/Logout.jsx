import React from 'react'
import './Logout.scss'
import {FiUser} from 'react-icons/fi'

const Logout = () => {
    function logout() {
        localStorage.removeItem('token')
        window.location.reload(false);
    }
  return (
    <div className="app__logout">
        <FiUser/>
        <button onClick={logout} >Logout</button>
    </div>
  )
}

export default Logout