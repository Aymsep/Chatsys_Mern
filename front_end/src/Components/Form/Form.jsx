import React,{useState,useEffect} from 'react'
import './Form.scss'


const Form = () => {
    const [isActive, setActive] = useState(false);

    const handleSignup = (e) => {
        e.preventDefault();
        const name = document.getElementById('up_name')
        const email = document.getElementById('up_email')
        const password = document.getElementById('up_password')
        
        fetch('http://localhost:3005/auth',{
        method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        
        
        
       
       
       

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
              <h2>Weekly Coding Challenge #1: Sign in/up Form</h2>
   <div className={`container ${isActive ? 'right-panel-active' : ''}`} id="container">
	<div className="form-container sign-up-container">
		<form action="#">
			<h1>Create Account</h1>
			<div className="social-container">
				<a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
				<a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
				<a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
			</div>
			<span>or use your email for registration</span>

			<input id='up_name' type="text" placeholder="Name" />
			<input id='up_email' type="email" placeholder="Email" />
			<input id='up_password' type="password" placeholder="Password" />

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
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<a href="#">Forgot your password?</a>
			<button >Sign In</button>
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

<footer>
	<p>
		Created with <i className="fa fa-heart"></i> by
		<a target="_blank" href="https://florin-pop.com">Florin Pop</a>
		- Read how I created this and how you can join the challenge
		<a target="_blank" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
	</p>
</footer>

    </div>
  )
}

export default Form