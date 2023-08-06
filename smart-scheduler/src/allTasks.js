import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';
import Popup from 'reactjs-popup';
import CreateNewTask from './createNewTask.js';
import Task from './task.js';

function AllTasks(){
    Axios.defaults.withCredentials = true;
    let navigate = useNavigate()
    const {user, setUser} = useContext(Context);
    const [tasks, setTasks]= useState([]);
    const [open, setOpen]= useState(false);
    const [loading, setLoading]= useState(false);

    // gets all tasks
    useEffect(()=>{
        setLoading(true)
        Axios.post("http://localhost:30011/getAllTasks", {userId: user.userId}).then((response)=>{
            setTasks(response.data)
            setLoading(false)
        })
    }, [])


    // shows all tasks page
    return(
        <>  

            {tasks.map((task, index)=>{
                return(
                    <Task task={task} setTasks={setTasks} index={index}/>
                )
            })}

            {!tasks.length && !loading && <p className='inform'>No tasks created</p>}
            {loading && <p className='inform'>Loading...</p>}

            <Popup open={open} trigger={<button>Add new task</button>}>
                <CreateNewTask setOpen={setOpen} daily = {false} setTasks={setTasks}/>
            </Popup>       
            
        </>
    )
}

export default AllTasks;