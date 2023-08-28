// import libraries 
const express = require("express");
const app = express();
var mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require("express-session");
const cookieParser = require('cookie-parser');
const Gmail = require('node-gmail-api')
const {Base64} = require('js-base64');
const bcrypt = require("bcrypt");
const saltRounds = 10;

// database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'smart_scheduler'
});


// configure chatGPT API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({apiKey: "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",});
const openai = new OpenAIApi(configuration);


app.listen(30011, ()=> {console.log(`Server started on port 30011`)});
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.json())
app.use(cors({origin: ["http://localhost:3000"], methods: ["GET", "POST"], credentials: true}))
app.use(session({key: "userLogin", secret: "isbf4t86r734hrf8i34r834h387yr843hr8343fghfdghcgffdusfsfsfsdfsdfsdppaspsap", resave: false, saveUninitialized: false, cookie: {expires: (60*60*24*60)}}))

// get session if  exists
app.get("/login", (req, res)=>{
    res.send({user: req.session.user})
})

// login or sign up if no account
app.post("/googleLogin", (req, res)=>{
    const user = req.body.user;

    // check if account exists
    db.query("select * from login where email = ?", [user.email], (err, result)=>{
        if(err){console.log(err)}
        
        else{

            // create account if no account
            if (result.length == 0){
                db.query("insert into login(email) values(?)", [user.email], (err, result)=>{
                    if(err){console.log(err)}
                    
                    else{
                        req.session.user = {userId: result.insertId, email: user.email};
                        res.send({user: {userId: result.insertId, email: user.email}})
                    }
                })
            }

            else{
                req.session.user = result[0];
                res.send({user: result[0]})
            }
        }
    })
})

// login
app.post("/login", (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    db.query("select email, password, userId from login where binary email = ? and password is not null", [email, password], (err, result) => {
        if (result.length > 0){
    
          bcrypt.compare(password, result[0].password, (err, response)=>{
            if (err){console.log(err)}
      
            if (response){
      
              req.session.user = result[0];
              res.send({user: result[0]})
            }
      
            else{
              res.send("Wrong combo")
            }
          })
        }
    
        else{
          res.send("Wrong email")
        }
      })
})

// sign up if no account
app.post("/signup", (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // check whether username already exists
    db.query("select userId from login where binary email = ?", [email], (err, result)=>{
        if (err){console.log(err)}

        if (result.length == 0){

            // encrypt password
            bcrypt.hash(password, saltRounds, (err, hash)=>{

                if (err){console.log(err)}

                // add encrypted password to database
                db.query("insert into login(email, password) values(?, ?)", [email, hash], (err, result)=>{
                if (err){console.log(err)}

                // create session for user and send userId
                req.session.user = {userId: result.insertId, email: email};
                res.send({user: {userId: result.insertId, email: email}})
                })

            })
        }
        else{
            res.send("email in use")
        }
    })
})

// get all tasks ordered by importance and date using ChatGPT
app.post("/getAllTasks", (req, res)=>{
    const userId = req.body.userId

    db.query("select * from tasks where userId = ?  and subtaskId is null", [userId], async (err, result)=>{
        if(err){console.log(err)}

        else{

            if (result.length > 1){
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "system", content: `Given a tasks array, rearrange it based on your opinion of how important it is and its date. Only return an ordered array and NO OTHER TEXT.`}, 
                    {role: "user", content: `Order the ${JSON.stringify(result)} task array in order of importance and date`}],
                });
    

                res.send(JSON.parse(completion.data.choices[0].message.content));
            }
            else{
                res.send(result)
            }


            res.send(result)


        }
    })
})

// get tasks that are due today ordered by importance and date using ChatGPT
app.post("/getDailyTasks", (req, res)=>{
    const userId = req.body.userId

    db.query("select * from tasks where userId = ? and  cast(tasks.date AS date) = cast(now() AS date) and subtaskId is null", [userId], async (err, result)=>{
        if(err){console.log(err)}

        else{

            if (result.length > 1){
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "system", content: `Given a tasks array, rearrange it based on your opinion of how important it is and its date. Only return an ordered array and NO OTHER TEXT.`}, 
                    {role: "user", content: `Order the ${JSON.stringify(result)} task array in order of importance and date`}],
                });
    

                res.send(JSON.parse(completion.data.choices[0].message.content));
            }
            else{
                res.send(result)
            }

            res.send(result)

        }
    })
})

// get subtasks for a task
app.post("/getSubtasks", (req, res)=>{
    const taskId = req.body.taskId

    db.query("select * from tasks where subtaskId = ?", [taskId], (err, result)=>{
        if(err){console.log(err)}

        else{
            res.send(result)
        }
    })
})

// use ChatGPT to get a date from a task string
app.post("/getDate", async (req, res)=>{
    const task = req.body.task

    if (task){
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "system", content: 'Find the datetime in format yyyy-MM-ddThh:mm in a string in the JSON format {"datetime": datetime, task: taskWithoutDatetime} and if there is no datetime, return {"datetime": null}. Only return PROPER JSON'}, 
            {role: "system", content: `What is the datetime in this string ${task} in JSON format`}],
        });
    
        res.send(JSON.parse(completion.data.choices[0].message.content));
    }
})  

// create a new task
app.post("/createNewTask", (req, res)=>{
    const userId = req.body.userId
    let date = req.body.date
    const task = req.body.task
    const taskDescription = req.body.taskDescription
    const subtaskId = req.body.subtaskId

    if (!date.length){
        date = null
    }

    db.query("insert into tasks(userId, date, task, taskDescription, subtaskId) values(?, ?, ?, ?, ?)", [userId, date, task, taskDescription, subtaskId], (err, result)=>{
        if(err){console.log(err)}

        else{
            res.send({task: {userId: userId, date: date, task: task, taskDescription: taskDescription, taskId: result.insertId}})
        }
    })
})

// delete a task and it's subtasks
app.post("/deleteTask", (req, res)=>{
    const taskId = req.body.taskId

    db.query("delete from tasks where taskId = ?", [taskId], (err, result)=>{
        if(err){console.log(err)}

        else{
            res.send("ok")
        }
    })
})

// use chatGPT to break the task into subtasks
app.post("/breakIntoSubtasks", (req, res)=>{
    const task = req.body.task

    db.query("select * from tasks where userId = ?", [task.userId], async (err, result)=>{
        if (err){console.log(err)}

        else{
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "system", content: `Break a task into subtasks and return the subtasks in the json format 
                {"subtasks": [{"subtask": subtask, "subTaskDescription": subTaskDescription, "date": datetime}]}. Take into 
                consideration the whole schedule and spread subtasks over multiple days if needed. Only return PROPER JSON. Don't return anything other than JSON.`}, 
                {role: "user", content: `give a schedule for task ${task.task + " " + task.taskDescription + "on " + task.date} given that the entire schedule 
                is ${result}`}],
            });
            
            let subtasks = JSON.parse(completion.data.choices[0].message.content).subtasks
            for (let i = 0; i < subtasks.length; i++) {

                db.query("insert into tasks(userId, date, task, taskDescription, subtaskId) values(?, ?, ?, ?, ?)", [task.userId, subtasks[i].date.substring(0, 16), subtasks[i].subtask, subtasks[i].subtaskDescription, task.taskId], (err, result)=>{
                    if (err){console.log(err)}
                })
            }

            res.send(subtasks)

            res.send([])
        }
    })
})

// get steps on how to complete a task from ChatGPT
app.post("/getSteps", async (req, res)=>{
    const task = req.body.task


    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "system", content: `Break a task into steps and return the steps in the json format 
        {"steps": []}. Only return PROPER JSON. Don't return anything other than JSON.`}, 
        {role: "user", content: `give steps to complete the task ${task.task + " " + task.taskDescription + "on " + task.date}`}],
    });

    res.send(JSON.parse(completion.data.choices[0].message.content));
    
})

// generate tasks from user's gmail
app.post("/mailTasker", async (req, res)=>{
    const gmail = new Gmail(req.body.accessToken)
    const s = await gmail.messages('label:inbox', {max: req.body.maxEmailNumber},)
    const userId = req.body.userId
    let tasks = []

    s.on('data', async function (d) {
        try {
            let email = ""
            var body = d.payload.parts[0].body.data;

            var htmlBody = Base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
            email += htmlBody

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "system", content: `Determine whether there is a task for the reciever of the email or not in an email and return a json in the format 
                {"task": task with only text (no emojis), "taskDescription": taskDescription with only text (no emojis), "date": datetime in the format YYYY-MM-DDTTTTT} if there is and {} if there is no 
                task in the email. Return ONLY JSON and NO OTHER TEXT and no emojis`}, 
                {role: "user", content: `Is there a task in the email ${email}`}],
            });


            if (JSON.parse(completion.data.choices[0].message.content).task){

                if (JSON.parse(completion.data.choices[0].message.content).date == 'null' ||  !JSON.parse(completion.data.choices[0].message.content).date || !JSON.parse(completion.data.choices[0].message.content).date.length){

                    db.query("insert into tasks(userId, date, task, taskDescription) values(?, ?, ?, ?)", 
                    [userId, null, cleanString(JSON.parse(completion.data.choices[0].message.content).task), 
                    cleanString(JSON.parse(completion.data.choices[0].message.content).taskDescription)], (err, result)=>{
    
                        if(err){console.log(err)}
                    })
                }
                else{
                    db.query("insert into tasks(userId, date, task, taskDescription) values(?, ?, ?, ?)", 
                    [userId, JSON.parse(completion.data.choices[0].message.content).date, cleanString(JSON.parse(completion.data.choices[0].message.content).task), 
                    cleanString(JSON.parse(completion.data.choices[0].message.content).taskDescription)], (err, result)=>{
    
                        if(err){console.log(err)}
                    })
                }


                tasks.push(JSON.parse(completion.data.choices[0].message.content))
            }
        }
        catch (error) {}
    })

    s.on("end", ()=>{
        res.send(tasks)
    })
})


function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127 || input.charCodeAt(i) >= 160 && input.charCodeAt(i) <= 255) {
            output += input.charAt(i);
        }
    }
    return output;
}
