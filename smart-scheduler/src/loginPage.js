import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import jwt_decode from "jwt-decode";
import  Axios  from 'axios';


function LoginPage(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user, setUser} = useContext(Context);

    const handleCallbackResponse = (response)=>{
        Axios.post("http://localhost:30011/login", {user: jwt_decode(response.credential)}).then((response2)=>{
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
    

    return(
      <>  
        <h1>Smart scheduler</h1>
        <div className='flexCol'>
            <div id = "signInDiv"></div>
        </div>
      </>
    )
}

export default LoginPage;