import React from 'react';
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { NavbarData } from './NavbarData';
import './Navbar.css';

export default function Navbar(props) {

    return (
        <nav className={props.sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={props.showSidebar}>
                <li className='navbar-toggle'>
                    <IconContext.Provider value={{color:'#000'}}>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose value={{ color: '#000' }}/>
                        </Link>
                    </IconContext.Provider>
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
    );
}
