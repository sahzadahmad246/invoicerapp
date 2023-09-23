import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../App";

const Logout = () => {

    const {state, dispatch} = useContext(userContext);

    const Navigate = useNavigate();
    useEffect(() => {

        
        fetch('/logout', {
            method: 'GET',
            headers: {
                Accept: "Application/json",
                "Content-TYpe": "Application/json"
            },
            credentials: "include"
        }).then((res) => {
            dispatch({type:"USER", payload:false});
            Navigate('/login', {replace: true});
            window.alert("Logged out")
            if(!res.status === 200){
                const error = new Error (res.error);
                throw error
            }
        }).catch((err) => {
            console.log(err)
        })

    })
    return(
        <>

        </>
    );
}

export default Logout;