import React,{useEffect,useState} from 'react'
import { useContext } from 'react'
import './App.scss'
import Form from './Components/Form/Form'
import Routes from './routes'
import { Usercontext,UserProvider } from './Usercontext'


const App = () => {
  return (
    <UserProvider>
      <Routes/>
    </UserProvider>
  )
}

export default App