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
    const {user, setUser} = useContext(Context);
    const [view, setView]= useState("daily tasks");

    
    useEffect(()=>{
        if (!user){
            Axios.get("http://localhost:30011/login").then((response)=>{
                console.log(response)
                if(response.data.user){
                    setUser(response.data.user);
                    navigate("/home")
                }
                else{
                    navigate("/") 
                }
            })
        }
    }, [])


    // show page based on user selection
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