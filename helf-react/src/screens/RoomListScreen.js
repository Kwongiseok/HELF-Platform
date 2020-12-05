import React, { Component } from "react";
import axios from "axios";
import { render } from "react-dom";
import { Redirect ,useHistory, Link} from "react-router-dom";
import styled from "styled-components";
import {HomeAlt} from '@styled-icons/boxicons-regular/HomeAlt';
import {Plus} from "@styled-icons/boxicons-regular/Plus";
import {Refresh} from "@styled-icons/material-sharp/Refresh"

/* global history */
/* global location */
/* global window */

/* eslint no-restricted-globals: ["off"] */ // location이나 history 같은 전역 변수를 ESLint가 참조할 수 있게 주석으로 명시

class RoomListScreen extends Component {
  // function RoomListScreen(props) {
  state = {
    loading: false,
    listItem: [],
    listAddress :[],
    mapping : {}
  };

  loadList = async () => {
    const server = axios.create();
    server.get('/api/roomList')
    .then((res)=> {
        console.log(res);
        const roomAddress = Object.values(res.data.roomGets)
        const names = Object.values(res.data.rooms);
        this.setState({
            loading : true,
            listItem : names,
            listAddress : roomAddress,
            })
        })
    };
    componentDidMount() {
        this.loadList();
    }
    
  render() {
    const { listItem,listAddress } = this.state;
    const listRoom = listItem.map((name) =><Link to={`/room/${listAddress[listItem.indexOf(name)]}`}><Rooms>{name}</Rooms></Link>);
    
    return (
      <Container>
        <NavBar>
          <Link to="/"><HomeBtn/></Link>
          <a href="/roomList"><RefreshBtn/></a>
          <Link to="/roomMake"><MakeBtn/></Link>
        </NavBar>
        <RoomList>{listRoom}</RoomList>
      </Container>
    );
  }
}

const Container = styled.div`
  width:100%;
`;

const NavBar = styled.div`
  display : flex;
  align-items : center;
  justify-content : space-around;
  width : 100%;
  height : 48px;
  margin : 0 auto 24px;
  background-color: #ecf0f1;
`;

const HomeBtn = styled(HomeAlt)`
  width : 48px;
  border : none;
  outline : none;
  margin : 4px;
  cursor : pointer;
  color : black;
`;

const MakeBtn = styled(Plus)`
  width : 48px;
  border : none;
  outline : none;
  margin : 4px;
  cursor : pointer;
  color : black;
`;

const RefreshBtn = styled(Refresh)`
  width : 48px;
  border : none;
  outline : none;
  margin : 4px;
  cursor : pointer;
  color : black;
`;

const Rooms = styled.button`
  width : 1024px;
  height : 48px;
  border : none;
  border-radius : 10px;
  outline : none;
  margin : 10px 0;
  padding : 0;
  cursor:pointer;

  transition: all 0.2s;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;
  &:hover {
    background-color : #bdc3c7;
  }
`;

const RoomList = styled.div`
  display : flex;
  flex-direction:column;
  align-items: center;
`;


export default RoomListScreen;
