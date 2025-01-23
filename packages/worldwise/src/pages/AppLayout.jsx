import React, { useEffect, useLayoutEffect } from "react";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";

import style from "./AppLayout.module.css"
import User from "../components/User";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function AppLayout() {
  const {isAuthenticated} = useAuth()
  const navigate = useNavigate();
  


  // useEffect(
  //   function(){  
  //     if(!isAuthenticated) {
  //       navigate("/", {replace: true})
  //       //return null; //does not work
  //     }
  //   }, [isAuthenticated, navigate]
  // )

 //if (!isAuthenticated) return null;
  
  return <div className={style.app}>
    <User/>
    <Sidebar />
    <Map />
  </div>;
}
