import React from 'react';
import { NavLink } from 'react-router-dom';
import  styles from './PageNav.module.css'

export default function PageNav(){
    return <nav className={styles.nav} >
        <ul>
        <li>
            <NavLink to="/">Home</NavLink>
        </li>
        <li>
            <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
            <NavLink to="/product">Products</NavLink>
            {/* <Link to="/products">Products</Link> */}
            {/* This create navigation elemets without the .active class unlike the NavLink */}
        </li>
        </ul>
    </nav>}