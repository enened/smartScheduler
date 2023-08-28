import {useContext, useState, useEffect} from "react";
import Axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { Context } from "./context.js";
import jwt_decode from "jwt-decode";

function SignupPage(){
    let navigate = useNavigate()
    const {setLoggedIn, setUser} = useContext(Context);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleCallbackResponse = (response)=>{
        Axios.post("http://localhost:30011/googleLogin", {user: jwt_decode(response.credential)}).then((response2)=>{
            setUser(response2.data.user)
            navigate("/home")
        })
    }
  
    // login using google
    useEffect(()=>{
        /* global google */
        const google = window.google;

        google.accounts.id.initialize({
        client_id: "166074828687-prontca2mjfsuajnmv7mp6pl6crte0v9.apps.googleusercontent.com",
        callback: handleCallbackResponse
        });
    
        google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {theme: "outline"}
        );
    
        
        google.accounts.id.prompt()
    }, [])

    const signup  = (e) =>{
        e.preventDefault();
        
        Axios.post("http://localhost:30011/signup", {email: email, password: password}).then((response)=>{

            if (response.data != "email in use"){
                setUser(response.data.user);
                navigate("/home")
            }
            else{
                alert("Your email is in use. Please choose a different one")
            }
        })
    }

    return(
        <div className="home">
            <h1>Sign up</h1>

            <p className = "link" onClick={()=>{navigate("/")}}>Already have a account? Login</p>

            <form onSubmit={signup}>
                <input type = "email" onChange={(e)=>{setEmail(e.target.value)}} required id = "username" className = "loginInput" placeholder="Email"/>
                <br/>
                <input type = "password" onChange={(e)=>{setPassword(e.target.value)}} required id = "password" className = "loginInput" placeholder="Password"/>
                <br/>
                
                <button type = "submit">Sign up</button>
            </form>

            <div className='flexCol'>
                <div id = "signInDiv"></div>
            </div>
        </div>
    )
}

export default SignupPage;