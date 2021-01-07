import React from 'react';
import * as IoIcons from 'react-icons/io';

export const NavbarData=[
    {
        title: 'Home',
        path : '/',
        icon : <IoIcons.IoMdHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Suppliers',
        path : '/suppliers',
        icon : <IoIcons.IoMdBicycle/>,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path : '/products',
        icon : <IoIcons.IoMdHeadset/>,
        cName: 'nav-text'
    },
    {
        title: 'Orders',
        path : '/orders',
        icon : <IoIcons.IoMdCart/>,
        cName: 'nav-text'
    },
    {
        title: 'Categories',
        path : '/categories',
        icon : <IoIcons.IoMdAlbums/>,
        cName: 'nav-text'
    },
    {
        title: 'Customers',
        path : '/customers',
        icon : <IoIcons.IoMdPeople/>,
        cName: 'nav-text'
    }
]