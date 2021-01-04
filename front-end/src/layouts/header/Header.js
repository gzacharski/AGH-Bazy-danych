import React from 'react';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import '../navbar/Navbar.css';

export default function Header(props){

    return(
        <header className="navbar bg-light">
                <div className='navbar-brand'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={props.showSidebar} />
                    </Link>
                    <span>Northwind Database - Neo4j</span>
                </div> 
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search in database" aria-label="Szukaj"/>
                    <button className="btn btn-primary" type="submit">Search</button>
                </form>
        </header>
    );
}