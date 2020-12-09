import React, { useEffect, useRef, useState } from "react";
// import { Nav, Navbar, NavItem } from 'react-bootstrap'
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {HomeAlt} from '@styled-icons/boxicons-regular/HomeAlt';

import {useHistory } from 'react-router-dom';

const videoConstraints = {
  // frameRate : {max : 30},
  height: window.innerHeight / 2.1,
  width: window.innerWidth / 2,
};

const Video = (props) => {
  const webcamRef = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      webcamRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div id="member video" style={{height : window.innerHeight/2.1,
      textAlign:'center',
      width: window.innerWidth/2}}>
      <StyledVideo id = "member" playsInline autoPlay ref={webcamRef} onClick={(e) => {}} />
    </div>
  );
};

const Room = (props) => {
  /* room */
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const roomName = window.sessionStorage.title;
  const history = useHistory();

  useEffect(() => {
    socketRef.current = io.connect("https://helf-node.herokuapp.com/");
    // socketRef.current = io.connect("http://localhost:5000/");

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        if(userVideo.current != null){
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", { roomID, roomName });
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find(p => p.peerID === id);
          if(peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(p => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });
      }
     });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      <NavBar>
        <HomeButton onClick={()=> {history.push("/");}}/>
        <Title>{window.sessionStorage.title}</Title>
      </NavBar>

      <div style={{height:window.innerHeight/2.1,textAlign:'center',
                   position : "relative",
                   width: window.innerWidth/2}} id = 'host video'>
        <StyledVideo id="parent" muted ref={userVideo} autoPlay playsInline onClick={(e) => {
            console.log(e);
          }}/>
      </div>
      {peers.map((peer, index) => {
        if(peer) return <Video key={index} peer={peer} />;
      })}
    </Container>
  );
};

// Style Section
const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  margin: auto;
  flex-wrap: wrap; 
  background-color : #1C1C1C;
`;

const NavBar = styled.header`
  background-color: #ecf0f1;
  width : 100%;
  height : 26px;  
  margin : 0 auto;
`;
const HomeButton = styled(HomeAlt)`
  width : 24px;
  border : none;
  outline : none;
  margin : 2px;
  height : 24px;
  cursor : pointer;
`;

const Title = styled.span`
`;

const StyledVideo = styled.video`
  height: ${window.innerHeight/2.1};
  width: ${window.innerWidth/2};
  position:"absolute";
`;

export default Room;
