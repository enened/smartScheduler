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
    const [maxEmailNumber, setMaxEmailNumber]= useState(10);


    // choose account for scanning gmail
    useEffect(()=>{
        /* global google */
        const google = window.google

        setTokenClient(
            google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_CLIENT_ID,
                scope: "https://www.googleapis.com/auth/gmail.readonly",
                callback: (tokenResponse) =>{
                    setMaxEmailNumber((maxEmailNumber)=>{
                        Axios.post("http://localhost:30011/mailTasker", {accessToken: tokenResponse.access_token, userId: user.userId, maxEmailNumber: maxEmailNumber}).then((response2)=>{
                            setLoading(false)
                            setDoneText(`${response2.data.length} task(s) added to through mail`)
                        })
                    })   
                }
            })
        )

        if (!user){
            navigate("/")
        }
    }, [])

    // show scan email buttons
    return(
        <>
            <form onSubmit={(e)=>{e.preventDefault(); tokenClient.requestAccessToken(); setLoading(true)}}>
                <p>Number of emails to scan:</p>
                <input type='number'className='loginInput' step={1} required onChange={(e)=>{setMaxEmailNumber(e.target.value)}}/>
                <br/>
                {loading && <p>Loading...</p>}
                {doneText}
                <button type='submit'>Scan Gmail for tasks</button>
            </form>
            

        </>
    )
}

export default MailTasker;