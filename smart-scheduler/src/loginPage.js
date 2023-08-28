import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import jwt_decode from "jwt-decode";
import  Axios  from 'axios';


function LoginPage(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user, setUser} = useContext(Context);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

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

    const login = (e) =>{
        e.preventDefault();
        Axios.post("http://localhost:30011/login", {email: email, password: password}).then((response) =>{

            if (response.data == "Wrong combo"){
                alert("Wrong username or password")
            }
            else if (response.data == "Wrong email"){
                alert("No account with that email")
            }
            else{
                setUser(response.data.user);
                navigate("/home")
            }
        })
    }
    

    return(
      <>  
        <h1>Smart scheduler</h1>
        <p className='link' onClick={()=>{navigate("/signup")}}>Don't have an account? Signup!</p>
        <form onSubmit={login} >
                <input type = "text"  onChange={(e)=>{setEmail(e.target.value)}} required className = "loginInput" placeholder="Username"/>
                <br/>
                <input type = "password" onChange={(e)=>{setPassword(e.target.value)}} required className = "loginInput" placeholder="Password"/>
                <br/>
                
                <button type = "submit">Login</button>
            </form>

        <div className='flexCol'>
            <div id = "signInDiv"></div>
        </div>
      </>
    )
}

export default LoginPage;