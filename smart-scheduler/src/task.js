import {useNavigate} from 'react-router-dom';
import { useState,useContext,  useEffect} from 'react';
import {Context} from "./context.js";
import  Axios  from 'axios';
import Popup from 'reactjs-popup';

function Task({task, setTasks, index}){
    const {user, setUser} = useContext(Context);
    const [subtasks, setSubtasks] = useState([])
    const [reviewSubtasks, setReviewSubtasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [steps, setSteps] = useState([])
    const [open, setOpen] = useState(false)
    const [subtasksOpen, setSubtasksOpen] = useState(false)
    const [newSubtaskOpen, setNewSubtaskOpen] = useState(false)
    const [subTask, setSubTask] = useState("")
    const [subTaskDescription, setSubTaskDescription] = useState("")
    const [subTaskDate, setSubTaskDate] = useState("")

    useEffect(()=>{
        Axios.post("http://localhost:30011/getSubtasks", {taskId: task.taskId}).then((response)=>{
            setSubtasks(response.data)
        })
    }, [])


    // delete task
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

    // break task into subtasks using ChatGPT
    const breakIntoSubtasks = (task, index)=>{
        Axios.post("http://localhost:30011/breakIntoSubtasks", {task: task}).then((response)=>{
            setReviewSubtasks(response.data)
            setSubtasksOpen(true)
        })
    }

    // get steps to finish task using ChatGPT
    const getSteps = (task)=>{
        setOpen(true)
        Axios.post("http://localhost:30011/getSteps", {task: task}).then((response)=>{
            setSteps(response.data.steps)
        })
    }

    // seperate date from task and description string
    const getDate = ()=>{
        Axios.post("http://localhost:30011/getDate", {task: subTask + " " + subTaskDescription}).then((response)=>{
            if (response.data.datetime &&  response.data.datetime != 'null'){
                setSubTaskDate(response.data.datetime)
                setSubTask(response.data.task)
            }
        })
    }
    
    // create the subtasks
    const saveSubTasks = ()=>{
        for (let i = 0; i < reviewSubtasks.length; i++) {

            Axios.post("http://localhost:30011/createNewTask", {task: reviewSubtasks[i].task, taskDescription: reviewSubtasks[i].taskDescription, subtaskId: task.taskId,  userId: user.userId, date: reviewSubtasks[i].date}).then((response)=>{
                setSubtasksOpen((tasks)=>[...tasks, response.data.task])
                setOpen(false)
            })            
        }

    }

    // show task
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

                    <Popup open={subtasksOpen} onClose={()=>{setSubtasksOpen(false); setReviewSubtasks([])}} nested>
                        <div className='reviewSlide'>
                            <h3>Review subtasks: </h3>
                            {(reviewSubtasks.length ? reviewSubtasks.map((subtask, index)=>{
                                return(
                                    <div className='reviewSubTaskSlide'>
                                        <div style={{"margin-left":"30px"}}>
                                            <p>{subtask.task}</p>
                                            <p>Description: {subtask.taskDescription}</p>
                                        </div>
                                        <p>Due: {subtask.date && subtask.date.substring(0, 10)} {subtask.date && subtask.date.substring(11, 16)}</p>

                                        <div>
                                            <button className="smallLightBlueButton" onClick={()=>{
                                                let tempTempSubtasks = [...reviewSubtasks]
                                                tempTempSubtasks.splice(index, 1)
                                                setReviewSubtasks(tempTempSubtasks)
                                            }}>Remove</button>                                            
                                        </div>
                                    </div>
                                )
                            }): <p>No subtasks</p>)}
                            
                            <Popup open={newSubtaskOpen} trigger={<button>Add new subtask</button>} nested>
                                <form className="createNewSlide" onSubmit={(e)=>{
                                    setNewSubtaskOpen(false);
                                    e.preventDefault(); 
                                    setReviewSubtasks([...reviewSubtasks, {task: subTask, taskDescription: subTaskDescription, date: subTaskDate}]); 
                                    setSubTask();
                                    setSubTaskDescription();
                                    setSubTaskDate();
                                }}>
                                    <h3>Create a new subtask</h3>
                                    <input type="text" required placeholder="Subtask" onChange={(e)=>{setSubTask(e.target.value)}} onBlur={getDate} value={subTask}/>
                                    <br/>
                                    <input type="text" placeholder="Description" onChange={(e)=>{setSubTaskDescription(e.target.value)}} onBlur={getDate}/>
                                    <br/>
                                    <input type="datetime-local" onChange={(e)=>{setSubTaskDate(e.target.value)}} value={subTaskDate}/>
                                    <button style={{"backgroundColor":"rgba(45,155,240,255)", "width":"auto"}} type='submit'>Create subtask</button>
                                </form>
                            </Popup>  

                            <br/>

                            <button onClick={saveSubTasks}>Save subtasks</button>
 
                        </div>
                        
                    </Popup>
                </div>
            </div>
            
            {/* show subtasks */}

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