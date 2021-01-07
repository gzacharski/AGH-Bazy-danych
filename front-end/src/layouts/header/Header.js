import React from 'react';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import '../navbar/Navbar.css';
import {BiSearch} from 'react-icons/bi'

export default function Header(props){
    const {showSidebar} = props;
    return(
        <header className="navbar bg-light">
            <div className='navbar-brand'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
                <span>Northwind Database - Neo4j</span>
            </div>
            <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Search in database" aria-label="Szukaj"/>
                <button className="btn btn-primary" type="button"><BiSearch/></button>
            </form>
        </header>
    );
}