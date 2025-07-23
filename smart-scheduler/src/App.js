import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useState} from "react";
import LoginPage from "./loginPage.js";
import HomePage from "./homePage.js";
import {Context} from "./context.js";
import Axios from 'axios'
import SignupPage from "./signup.js"

function App() {
    Axios.defaults.withCredentials = true;
    const [user, setUser] = useState(false)
    const [tokenClient, setTokenClient]= useState({});

    return (
        <Context.Provider value={{user, setUser, tokenClient, setTokenClient}}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<LoginPage />}/>
                    <Route exact path="/signup" element={<SignupPage />}/>
                    <Route exact path="/home" element={<HomePage />}/>
                </Routes>
            </Router>
        </Context.Provider>
    )
}



export default App;