import React, { useState } from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/App.css';
import Header from './layouts/header/Header';
import Navbar from './layouts/navbar/Navbar';
import Page from './layouts/Page';
import Footer from "./layouts/Footer";

export default function App (){

  const [sidebar,setSideBar]=useState(false);

  const showSidebar= () => setSideBar(!sidebar);

  return (
      <Router>
        <Header sidebar={sidebar} showSidebar={showSidebar}/>
        <Navbar sidebar={sidebar} showSidebar={showSidebar}/>
        <Page/>
        <Footer/>
      </Router>
  );
}