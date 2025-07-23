import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';
import Popup from 'reactjs-popup';
import CreateNewTask from './createNewTask.js';
import Task from './task.js';

const date = new Date();

function DailyTasks(){
    Axios.defaults.withCredentials = true;
    const {user} = useContext(Context);
    const [tasks, setTasks]= useState([]);
    const [open, setOpen]= useState(false);
    const [loading, setLoading]= useState(false);


    // gets daily tasks
    useEffect(()=>{
        setLoading(true)
        Axios.post("http://localhost:30011/getDailyTasks", {userId: user.userId, todaysDate: date}).then((response)=>{
            setTasks(response.data)
            setLoading(false)
        })
    }, [])


    // shows daily tasks
    return(
        <>
            {tasks.map((task, index)=>{
                return(
                    <Task task={task} setTasks={setTasks} index={index}/>
                )
            })}

            {!tasks.length && !loading && <p className='inform'>No tasks for today</p>}
            {loading && <p className='inform'>Loading...</p>}


            <Popup open={open} trigger={<button>Add new task</button>}>
                <CreateNewTask setOpen={setOpen} daily = {true} setTasks={setTasks}/>
            </Popup>          
        </>
    )
}

export default DailyTasks;