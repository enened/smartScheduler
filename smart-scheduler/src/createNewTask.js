import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';



function CreateNewTask({setOpen, setTasks, daily}){
    const {user, setUser} = useContext(Context);
    const [task, setTask]= useState("");
    const [taskDescription, setTaskDescription]= useState("");
    const [date, setDate]= useState("");


    // seperate date from task and description string
    const getDate = ()=>{
        Axios.post("http://localhost:30011/getDate", {task: task + " " + taskDescription}).then((response)=>{
            if (response.data.datetime &&  response.data.datetime != 'null'){
                setDate(response.data.datetime)
                setTask(response.data.task)
            }
        })
    }

    // create new task
    const createNewTask = (e)=>{
        e.preventDefault()

        let today = new Date()
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        if (day.toString().length == 1){
            day = "0" + day
        }
        
        if (month.toString().length == 1){
            month = "0" + month
        }
        
        today = `${year}-${month}-${day}`;

        Axios.post("http://localhost:30011/createNewTask", {task: task, taskDescription: taskDescription, userId: user.userId, date: date}).then((response)=>{

            if (!daily || date.substring(0, 10) == today){
                console.log(!daily || date.substring(0, 10) == today)
                setTasks((tasks)=>[...tasks, response.data.task])
            }

            setOpen(false)
        })
    }


    return(
        <>

            <form className="createNewSlide" onSubmit={createNewTask}>
                <h3>Create a new task</h3>
                <input type="text" required placeholder="Task"onChange={(e)=>{setTask(e.target.value)}} onBlur={getDate} value={task}/>
                <br/>
                <input type="text" placeholder="Description" onChange={(e)=>{setTaskDescription(e.target.value)}} onBlur={getDate}/>
                <br/>
                <input type="datetime-local" onChange={(e)=>{setDate(e.target.value)}} value={date}/>
                <button style={{"backgroundColor":"rgba(45,155,240,255)", "width":"auto"}} type='submit'>Create task</button>
            </form>
        </>
    )
}

export default CreateNewTask;