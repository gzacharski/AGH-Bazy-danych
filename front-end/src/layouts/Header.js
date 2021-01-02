import React from 'react';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import './navbar/Navbar.css';

export default function Header(props){

    return(
        <header className="navbar">
             <div className="container-fluid">
                <div className='navbar'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={props.showSidebar} />
                    </Link>
                </div> 
                <a className="navbar-brand">Baza Northwind</a>
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj"/>
                    <button className="btn btn-outline-success" type="submit">Szukaj</button>
                </form>
            </div>
        </header>
    );
}