import React,{useState,useEffect,useRef, useContext} from 'react'
import './Form.scss'
import axios from 'axios'

import {useNavigate} from 'react-router-dom'

import { Usercontext } from '../../Usercontext';


const Form = () => {
    const {setusername,setid,setToken} = useContext(Usercontext)
    const [isActive, setActive] = useState(false);

    const [buttonclicked, setbuttonclicked] = useState(true)
    const buttonref = useRef(null)

    // useEffect(()=>{
    //   if(buttonref.current && buttonclicked) {
    //     console.log('clicked')
    //     buttonref.current.click()

    //   }
    // },[buttonclicked])
    
    const handleSignup = async (e) => {
      e.preventDefault();
      const up_name = document.getElementById('up_name').value;
      const up_email = document.getElementById('up_email').value;
      const up_password = document.getElementById('up_password').value;
      const up_file = document.getElementById('up_file').files[0];
    
      const formData = new FormData();
      formData.append('name', up_name);
      formData.append('email', up_email);
      formData.append('password', up_password);
      formData.append('image', up_file);
    
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',// Set the correct Content-Type header
            'Content-Type': 'multipart/form-data', // Set the correct Content-Type header
          },
        };
    
        const response = await axios.post('http://localhost:3005/register', formData, config);
    
        const { fullname, id } = response.data;
        if (fullname) {
          buttonref.current.click();
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    };

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
			<input id='up_file' type="file" placeholder="enter your image" required />

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
			<button onClick={(e)=>handleSignin(e)}  >Sign In</button>
		</form>
	</div>
	<div className="overlay-container">
		<div className="overlay">
			<div className="overlay-panel overlay-left">
				<h1>Welcome Back!</h1>
				<p>To keep connected with us please login with your personal info</p>
				<button className="ghost" id="signIn" ref={buttonref}>Sign In</button>
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