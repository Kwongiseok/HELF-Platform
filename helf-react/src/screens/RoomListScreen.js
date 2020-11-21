import React, { Component } from 'react';
import axios from 'axios';
import { render } from 'react-dom';

class RoomListScreen extends Component {

// function RoomListScreen(props) {
    state = {
        loading : false,
        listItem : [],
    }

    loadList = async () => {
    const server = axios.create();
    server.get('/api/roomList')
    .then((res)=> {
        const names = Object.values(res.data);
        this.setState({
            loading : true,
            listItem : names,
        })
        // const listItem = names.map((name) => <li>{name}</li>);
        // console.log(listItem);
        // return (<ul>{listItem}</ul>);
        })
    };
    componentDidMount() {
        this.loadList();
    }

    render() {
        const {listItem} = this.state;
        const listRoom = listItem.map((name) => <li>{name}</li>);
        return (
            <ul>{listRoom}</ul>
        )
    }
    
}
export default RoomListScreen;