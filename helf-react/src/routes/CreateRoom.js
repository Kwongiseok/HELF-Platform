import React from "react";
import { v1 as uuid } from "uuid";
import LoginScreen from "../screens/LoginScreen"

function isLogged(){
    let res;
    {window.sessionStorage.isLogin ? res = true : res = false }
    return res;
}

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        window.sessionStorage.isLogin ?
        <button onClick={create}>Create room</button> : <LoginScreen/>
    ); 
};

export default CreateRoom;