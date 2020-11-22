import React from "react";
import { v1 as uuid } from "uuid";
import LoginScreen from "../screens/LoginScreen";
import { Redirect } from "react-router-dom";

const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }
  return (
    // window.sessionStorage.isLogin ?
    // <button onClick={create}>Create room</button> : <Redirect to ="/"/>

    <button onClick={create}>Create room</button>
  );
};

export default CreateRoom;
