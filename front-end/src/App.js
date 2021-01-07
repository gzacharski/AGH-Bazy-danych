import React, { useState } from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/App.css';
import Header from './layouts/header/Header';
import Navbar from './layouts/navbar/Navbar';
import Page from './layouts/Page';
import Footer from "./layouts/Footer";
import LoginForm from "./layouts/LoginForm";
import CustomerContext from "./layouts/CustomerContext.js";

export default function App (){

    const [sidebar,setSideBar]=useState(false);
    const [loggedIn,setLoggedIn]=useState(false);
    const [customerId,setCustomerId]=useState("");

    const showSidebar= () => setSideBar(!sidebar);

    return (
        <Router>
            {
                loggedIn ?
                <div>
                    <Header sidebar={sidebar} showSidebar={showSidebar}/>
                    <Navbar sidebar={sidebar} showSidebar={showSidebar}/>
                    <CustomerContext.Provider value={customerId}>
                        <Page/>
                    </CustomerContext.Provider>
                    <Footer/>
                </div>
                :
                <LoginForm setCustomerId={setCustomerId} setLoggedIn={setLoggedIn}/>
            }
        </Router>
    );
}