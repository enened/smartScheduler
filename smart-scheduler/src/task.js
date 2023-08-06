import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';
import Popup from 'reactjs-popup';

function Task({task, setTasks, index}){
    const [subtasks, setSubtasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [steps, setSteps] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(()=>{
        Axios.post("http://localhost:30011/getSubtasks", {taskId: task.taskId}).then((response)=>{
            setSubtasks(response.data)
        })
    }, [])

    const deleteTask = (taskId, index, subtask)=>{
        Axios.post("http://localhost:30011/deleteTask", {taskId: taskId}).then((response)=>{
            if (subtask){
                setSubtasks((tasks)=>{
                    let tempTasks = [...tasks]
                    tempTasks.forEach((task, index) => {
                        if (task.taskId == taskId){
                            tempTasks.splice(index, 1)
                        }
                    }); 
                    return tempTasks
                })
            }
            else{
                setTasks((tasks)=>{
                    let tempTasks = [...tasks]
                    tempTasks.forEach((task, index) => {
                        if (task.taskId == taskId){
                            tempTasks.splice(index, 1)
                        }
                    }); 
                    return tempTasks
                })
            }
        })
    }

    const breakIntoSubtasks = (task, index)=>{
        setLoading(true)
        Axios.post("http://localhost:30011/breakIntoSubtasks", {task: task}).then((response)=>{

            Axios.post("http://localhost:30011/getSubtasks", {taskId: task.taskId}).then((response)=>{
                setSubtasks(response.data)
                setLoading(false)
            })
        })
    }

    const getSteps = (task)=>{
        setOpen(true)
        Axios.post("http://localhost:30011/getSteps", {task: task}).then((response)=>{
            setSteps(response.data.steps)
        })
    }


    
    return(
        <>
            <div className='taskSlide'>
                <div style={{"margin-left":"30px"}}>
                    <p>{task.task}</p>
                    <p>Description: {task.taskDescription}</p>
                </div>
                <p>Due: {task.date && task.date.substring(0, 10)} {task.date && task.date.substring(11, 16)}</p>

                <div>
                    <button className="smallLightBlueButton" onClick={()=>{deleteTask(task.taskId, index)}}>Delete</button>
                    <button className="smallLightBlueButton" onClick={()=>{getSteps(task)}}>Get steps</button>
                    <Popup open={open} onClose={()=>{setOpen(false); setSteps([])}}>
                        <div className='reviewSlide'>
                            <h4>Steps:</h4>
                            {(steps && steps.length > 0) ? steps.map((step, index)=>{
                                return(
                                    <p>{step}</p>
                                )
                            }) : <p>Loading...</p>}
                        </div>
                    </Popup>   
                    <button className="smallLightBlueButton" onClick={()=>{breakIntoSubtasks(task, index)}}>Break into subtasks</button>
                </div>
            </div>

            {subtasks && subtasks.map((subtask)=>{
                return(
                    <div className='subtaskSlide'>
                        <div style={{"margin-left":"30px"}}>
                            <p>{subtask.task}</p>
                            <p>Description: {subtask.taskDescription}</p>
                        </div>
                        <p>Due: {subtask.date && subtask.date.substring(0, 10)} {subtask.date && subtask.date.substring(11, 16)}</p>

                        <div>
                            <button className="smallLightBlueButton" onClick={()=>{deleteTask(subtask.taskId, index, subtask)}}>Delete</button>
                        </div>
                    </div>
                )
            })}

            {loading && <p className='inform'>Loading...</p>}
        </>
    )
}

export default Task;