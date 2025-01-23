import React, { useEffect } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRouter({children}){
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate();

    useEffect(
        function (){
            if(!isAuthenticated) navigate("/")
        }, [isAuthenticated, navigate]
    )

    if(!isAuthenticated) return null
    return children
}