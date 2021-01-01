import React, { Component } from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/App.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Page from './Page';
import Footer from "./Footer";

class App extends Component {

  state = {
    
  };

  render() {
    return (
      <Router>
        <Header/>
        <div className="container">
          <main>
            <Sidebar/>
            <Page/>
          </main>
        </div>
        <Footer/>
      </Router>
    );
  }
}

export default App;
