# SmartScheduler
A web application to manage tasks with an AI scheduler. Won 4th place at the United Hacks Hackathon. 

## Features
* Add tasks manually including information like due date and descriptions
* View your tasks in one of two views: daily view and all tasks
* Automatically have tasks sorted based on urgency (based on due date and description)
* Automatically fill out time and date fields from the task description and title
* Break the task into subtasks using AI
* Automatically grab tasks and task information (due date and description) from emails

## Built with
* Node.js/Express
* React.js
* MySQL database
* ChatGPT API

## Getting Started
1. Clone repository

```bash
git clone https://github.com/enened/smartScheduler.git
```

2. Start React

```bash
cd smart-scheduler
npm install
npm start
```

3. Set up MySQL database by running the sqlScript.sql file
4. Enter database credentials and OpenAI API key in a .env file
```env
DB_HOST = localhost
DB_USER = youruser
DB_PASSWORD = yourpassword
API_KEY = yourapikey
```

5. Enter your google client id in an env file inside the smart-scheduler folder
```env
REACT_APP_CLIENT_ID = yourclientid
```

6. Start your express server
```bash
npm install
node index.js
```

## Notes
This project was created in limited time at a hackathon and focuses on the core functionality. Limitations include:
* Limited input validation and error handling
* Basic styling
