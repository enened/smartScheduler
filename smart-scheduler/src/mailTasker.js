import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';

function MailTasker(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user, setUser, tokenClient, setTokenClient} = useContext(Context);
    const [loading, setLoading]= useState(false);
    const [doneText, setDoneText]= useState("");

    useEffect(()=>{
        /* global google */
        const google = window.google

        setTokenClient(
            google.accounts.oauth2.initTokenClient({
                client_id: "166074828687-prontca2mjfsuajnmv7mp6pl6crte0v9.apps.googleusercontent.com",
                scope: "https://www.googleapis.com/auth/gmail.readonly",
                callback: (tokenResponse) =>{
                    Axios.post("http://localhost:30011/mailTasker", {accessToken: tokenResponse.access_token, userId: user.userId}).then((response2)=>{
                        setLoading(false)
                        setDoneText(`${response2.data.length} task(s) added to through mail`)
                    })
                }
            })
        )

        if (!user){
            navigate("/")
        }
    }, [])

    

    return(
        <>
            <p>Automatically create tasks from your gmail!</p>
            {loading && <p>Loading...</p>}
            <button onClick={()=>{tokenClient.requestAccessToken(); setLoading(true)}}>Scan Gmail for tasks</button>

        </>
    )
}

export default MailTasker;