import React from 'react';
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import {NavbarData } from './NavbarData';
import './Navbar.css';

export default function Navbar(props) {

    return (
        <>
            <IconContext.Provider value={{color : '#fff' }}>
                <nav className={props.sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={props.showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {NavbarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}
