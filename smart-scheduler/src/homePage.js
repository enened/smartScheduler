import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';
import DailyTasks from './dailyTasks.js';
import AllTasks from './allTasks.js';
import MailTasker from "./mailTasker.js"


function HomePage(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user, setUser, tokenClient, setTokenClient} = useContext(Context);
    const [view, setView]= useState("daily tasks");

    
    useEffect(()=>{
        // /* global google */
        // const google = window.google

        // setTokenClient(
        //     google.accounts.oauth2.initTokenClient({
        //         client_id: "166074828687-prontca2mjfsuajnmv7mp6pl6crte0v9.apps.googleusercontent.com",
        //         scope: "https://www.googleapis.com/auth/gmail.readonly",
        //         callback: (tokenResponse) =>{
        //             console.log(tokenResponse)
        //         }
        //     })
        // )

        if (!user){
            navigate("/")
        }
    }, [])

    return(
        <>
            <h1>SmartScheduler</h1>

            {/* menu buttons */}
            <button style={view == "daily tasks" ? {"backgroundColor":"rgba(45,155,240,255)"} : {}} onClick={()=>{setView("daily tasks")}}>Daily Tasks</button>
            <button style={view == "all tasks" ? {"backgroundColor":"rgba(45,155,240,255)"} : {}} onClick={()=>{setView("all tasks")}}>All Tasks</button>
            <button style={view == "mail tasker" ? {"backgroundColor":"rgba(45,155,240,255)"} : {}} onClick={()=>{setView("mail tasker")}}>Mail Tasker</button>
            <br/>


            {view == "daily tasks" && <DailyTasks />}
            {view == "all tasks" && <AllTasks />}
            {view == "mail tasker" && <MailTasker />}
        </>
    )
}


export default HomePage;