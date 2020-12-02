import React, { Component } from "react";
import axios from "axios";
import { render } from "react-dom";
import { Redirect ,useHistory, Link} from "react-router-dom";
import styled from "styled-components";
import {HomeAlt} from '@styled-icons/boxicons-regular/HomeAlt';

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
          <HomeButton></HomeButton>
          
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
  background-color: #ecf0f1;
  width : 100%;
  height : 48px;
  margin : 0 auto;
  margin-bottom: 24px;
`;

const HomeButton = styled(HomeAlt)`
  width : 36px;
  border : none;
  outline : none;
  margin : 4px;
`;

const Rooms = styled.button`
  width : 1024px;
  height : 48px;
  border : none;
  border-radius : 10px;
  outline : none;
  margin 10px 0;
`;

const RoomList = styled.div`
  display : flex;
  flex-direction:column;
  align-items: center;
  
`;


export default RoomListScreen;
