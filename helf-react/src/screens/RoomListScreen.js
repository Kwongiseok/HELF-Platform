import React, { Component } from "react";
import axios from "axios";
import { render } from "react-dom";
import { Redirect ,useHistory, Link} from "react-router-dom";
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
  // redirectToRoom = (name) => {
  //   let history = useHistory();
  //   const {listItem , listAddress} = this.state;
  //   const url = listAddress[listItem.indexOf(name)]
  //   history.push('/room/${url}');
  // }
  render() {
    const { listItem,listAddress } = this.state;
    const listRoom = listItem.map((name) =><Link to={`/room/${listAddress[listItem.indexOf(name)]}`}><button>{name}</button></Link>);
    return <ul>{listRoom}</ul>;
  }
}
export default RoomListScreen;
