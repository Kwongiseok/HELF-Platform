import React, { useEffect, useRef, useState } from "react";
// import { Nav, Navbar, NavItem } from 'react-bootstrap'
import io from "socket.io-client";
import Peer from "simple-peer";
import {Link} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { drawKeypoints, drawSkeleton } from "../utilities";
import {HomeAlt} from '@styled-icons/boxicons-regular/HomeAlt';
import {Exit} from '@styled-icons/boxicons-regular/Exit';

import {useHistory } from 'react-router-dom';

/* tensorflow */
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";


const videoConstraints = {
  frameRate : {max : 30},
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
      {/* <canvas ref={canvasRef} style={{width:window.innerWidth/2, height:window.innerHeight/2.1,
          position:"absolute", left :0,top:0,
          }}/> member의 pose 인식할 수도 있음*/} 
    </div>
    // {/* //    <canvas ref = {canvasRef} />
    // //    <NameTag>{window.sessionStorage.name}</NameTag> */}
  );
};

const Room = (props) => {
  /* video */
  const canvasRef = useRef();
  /* room */
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const roomName = window.sessionStorage.title;

  const history = useHistory();

  const detect = async (net) => {
    if (
      typeof userVideo !== "undefined" &&
      typeof userVideo.current !== "undefined" &&
      userVideo.current !== null &&
      userVideo.current.readyState === 4
    ) {
      const video = userVideo.current;
      const videoWidth = userVideo.current.videoWidth;
      const videoHeight = userVideo.current.videoHeight;
      // Set video width
      userVideo.current.width = videoWidth;
      userVideo.current.height = videoHeight;

      // Make Detection
      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };
  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);

  };
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: window.innerWidth/2, height: window.innerHeight/2.1 },
      scale: 0.5,
    });
    setInterval(() => {
      detect(net);
    }, 100);
  };

  // if(userVideo) {runPosenet();}
  
  useEffect(() => {
    // socketRef.current = io.connect("https://helf-node.herokuapp.com/");
    socketRef.current = io.connect("http://localhost:5000/");

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
        {/* <heart></heart>
        <heartRate></heartRate>
        <profile></profile> navbar에 추가할 심박수, 프로필*/}
        <span>{window.sessionStorage.name}</span>
      </NavBar>
      <div style={{height:window.innerHeight/2.1, textAlign:'center',
                   position : "relative",
                   width: window.innerWidth/2}} id = 'host video'>
        <StyledVideo
          id="parent"
          muted
          ref={userVideo}
          autoPlay
          playsInline
          onClick={(e) => {
            console.log(e);
          }}/>
          <canvas ref={canvasRef} style={{width:window.innerWidth/2, height:window.innerHeight/2.1,
          position:"absolute", left :0,top:0,
          }}/>
      </div>
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}

      {/* { console.log(peers)} */}

    </Container>
  );
};

const GlobalStyle = createGlobalStyle`
    body {
        background-color : black;
    }
`;

const ExitBtn = styled(Exit)` 
  height : 48px;
  width : 48px;
  border : none;
  outline : none;
  margin : 4px;
  cursor : pointer;
  color : white;
`;

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
const StyledVideo = styled.video`
  height: ${window.innerHeight/2.1};
  width: ${window.innerWidth/2};
  position:"absolute";
  // zindex: 9,
  // position: "absolute",
  margin-left: "auto";
  margin-right: "auto";
  left: 0;
  top: 0;
  // textAlign: "center",
  // zindex: 9,
  // width: 640,
  // height: 480,
`;


const NameTag = styled.h1`
  text-align: center;
  color: white;
  font-size: 20px;
`;

export default Room;
