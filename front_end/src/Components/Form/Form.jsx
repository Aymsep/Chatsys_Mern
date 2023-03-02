import React,{useState,useEffect, useContext} from 'react'
import './Form.scss'

import { Usercontext } from '../../Usercontext';


const Form = () => {
    const {setusername,setid,setToken} = useContext(Usercontext)
    const [isActive, setActive] = useState(false);

    
    const handleSignup = async (e) => {
      e.preventDefault();
      const up_name = document.getElementById('up_name')
      const up_email = document.getElementById('up_email')
      const up_password = document.getElementById('up_password')
      
      const response = await fetch('http://localhost:3005/register',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: up_name.value,
          email: up_email.value,
          password: up_password.value
        })
        
        })
        const {fullname,id} = await response.json()
        
       
      }

    const handleSignin = async (e)=>{
        e.preventDefault();
        const in_email = document.getElementById('in_email')
        const in_password = document.getElementById('in_password')
        const response = await fetch('http://localhost:3005/login',{
            method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: in_email.value,
                    password: in_password.value
                })
            })
        const data = await response.json();
        setusername(data.fullname)
        setid(data.userId)
        setToken(data.token)
    }

    useEffect(() => {
      const container = document.getElementById('container');
      const signUpButton = document.getElementById('signUp');
      const signInButton = document.getElementById('signIn');
  
      function handleSignUpClick() {
        setActive(true);
      }
  
      function handleSignInClick() {
        setActive(false);
      }
  
      signUpButton.addEventListener('click', handleSignUpClick);
      signInButton.addEventListener('click', handleSignInClick);
  
      return () => {
        signUpButton.removeEventListener('click', handleSignUpClick);
        signInButton.removeEventListener('click', handleSignInClick);
      };
    }, []);
  
  return (
    <div>
   <div className={`app__form container ${isActive ? 'right-panel-active' : ''}`} id="container">
	<div className="form-container sign-up-container">
		<form action="#">
			<h1>Create Account</h1>
			<div className="social-container">
				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
			</div>
			<span>or use your email for registration</span>

			<input id='up_name' type="text" placeholder="Name" required/>
			<input id='up_email' type="email" placeholder="Email" required/>
			<input id='up_password' type="password" placeholder="Password" required />

			<button  onClick={(e) =>handleSignup(e)} >Sign Up</button>
		</form>
	</div>
	<div className="form-container sign-in-container">
		<form action="#">
			<h1>Sign in</h1>
			<div className="social-container">
				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
			</div>
			<span>or use your account</span>

			<input  id="in_email" type="email" placeholder="Email" />
			<input  id="in_password" type="password" placeholder="Password" />

			<a href="#">Forgot your password?</a>
			<button onClick={(e)=>handleSignin(e)} >Sign In</button>
		</form>
	</div>
	<div className="overlay-container">
		<div className="overlay">
			<div className="overlay-panel overlay-left">
				<h1>Welcome Back!</h1>
				<p>To keep connected with us please login with your personal info</p>
				<button className="ghost" id="signIn">Sign In</button>
			</div>
			<div className="overlay-panel overlay-right">
				<h1>Hello, Friend!</h1>
				<p>Enter your personal details and start journey with us</p>
				<button
                 className="ghost" 
                 id="signUp"   
                 >Sign Up</button>
			</div>
		</div>
	</div>
</div>


    </div>
  )
}

export default Form