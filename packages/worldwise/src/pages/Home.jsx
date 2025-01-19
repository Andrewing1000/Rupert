import React from 'react';
import { Link } from 'react-router-dom';
import PageNav from '../component/PageNav';
import AppNav from  '../component/AppNav';

export default function Home(){
    return <div>
        <PageNav/>
        <AppNav/>
        <h1 className="test">Test</h1> 
        {/* Wont work becase the classes defined in AppNav.module.css
         are not scoped to this file unless the
        :global function is used in css*/}
        <h1>WorldWise</h1>
        {/* <a href="/pricing">Pricing</a>  */}
        {/* This still realoads the entire page */}
        <Link to='/pricing'>Pricing</Link>
        {/* "/" is important to specify the root */}
        </div>
} 

//React styling:
//Inline CSS with the style Object
//Global CSS with the className atribute
//*CSS Modules: One single CSS file is scoped to each component (uses ClassName)
//CSS-in-JS: CSS is written inside the JSX file --> Creates exernal component
//Utility-first CSS like Tailwind --> ClassName prop
//Using a component library: MaterialUI, etc




