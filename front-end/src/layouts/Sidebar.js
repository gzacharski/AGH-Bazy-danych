import React from 'react';
import {NavLink} from 'react-router-dom';

const list=[
    {name:'Start', path: '/',exact: true},
    {name:'Suppliers', path: '/supplier'},
    {name:'Products', path:'/products'},
    {name:'Orders',path:'/orders'},
    {name:'Categories',path:'/category'},
    {name:'Customers',path:'/customer'},
    {name:'Shippers',path:'/shipper'},
    {name:'Regions',path:'/regions'},
    {name:'Employees',path:'/employees'}
];

const Sidebar = () => {

    const menu =list.map( item =>(
        <li key={item.name}>
            <NavLink to={item.path} exact={item.exact ? item.exact : false}>{item.name}</NavLink>
        </li>
    ));

    return (
        <aside>
            <ul>
                {menu}
            </ul>
        </aside>
    );
}

export default Sidebar;