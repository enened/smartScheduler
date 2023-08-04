const express = require("express");
const app = express();
var mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require("express-session");
const cookieParser = require('cookie-parser');

// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'smart_scheduler'
});


app.listen(30011, ()=> {console.log(`Server started on port 30011`)});
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.json())
app.use(cors({origin: ["http://localhost:3000"], methods: ["GET", "POST"], credentials: true}))
app.use(session({key: "userLogin", secret: "isbf4t86r734hrf8i34r834h387yr843hr8343fghfdghcgffdusfsfsfsdfsdfsdppaspsap", resave: false, saveUninitialized: false, cookie: {expires: (60*60*24*60)}}))


