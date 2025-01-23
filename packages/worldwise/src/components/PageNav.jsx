import React from "react";
import styles from "./PageNav.module.css";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";

export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink to="/login" className={styles.ctaLink}>Login</NavLink>
          {/* ctaLink is cammel cased so you can direcly access it with . notation
          instead of the [<string>] */}
        </li>
      </ul>
    </nav>
  );
}
 

//URL is an easy way to store global state
//Page state can be packed for posterity in the URL.
//making the user able to save the page state as a string

