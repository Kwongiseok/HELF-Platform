import React, { useRef,Component,useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "../utilities";
import styled, { createGlobalStyle } from "styled-components";
import {HomeAlt} from '@styled-icons/boxicons-regular/HomeAlt';
import {useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { v1 as uuid } from "uuid";

// class SoloRoomScreen extends Component {

const SoloRoomScreen = () => {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const history = useHistory();
  let [Url, setUrl] = useState("");
  let url = window.sessionStorage.getItem.url;
  let tmp_height = window.innerHeight-100;
  let tmp_width = window.innerWidth/2.1;
  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: window.innerWidth/2.1, height: window.innerHeight-100 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      console.log(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    if(canvas.current) {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
    }
  };

  runPosenet(); // Motion 인식

  return (
    <Container >
        <NavBar><HomeButton onClick={()=> {history.push("/");}}/></NavBar>
        <Menubar>
          <input value = {Url} onChange={(e) => setUrl(e.target.value)}/>
          <button onClick={{}}>검색</button>
        </Menubar>
        
        <div style={{height:window.innerHeight-100, textAlign:'center',
                   position : "relative",
                   width: window.innerWidth/2.1}} id = 'Youtube video'>
        <ReactPlayer url= 'https://www.youtube.com/watch?v=CYcLODSeC-c'
            padding='10px'
            position="absolute"
            left='0'
            zindex='9px'
            width= {tmp_width}
            height= {tmp_height}
            // playing 
            controls/>        
        </div>

        <div style={{height:window.innerHeight-100, textAlign:'center',
                   position : "relative",
                   padding : 10,
                   width: window.innerWidth/2.1}} id = 'host video'>
        <Webcam
          ref={webcamRef}
          style={{
            padding : 10,
            position: "absolute",
            left : 0,
            zindex: 9,
            width: window.innerWidth/2.1,
            height: window.innerHeight-100,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            padding : 10,
            left : 0,
            position: "absolute",
            zindex: 9,
            width: window.innerWidth/2.1,
            height: window.innerHeight-100,
          }}
        />
        </div>
    </Container>
  );
}

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

const Menubar = styled.form`
  width : 100%;
  margin : 0 auto;
  display : flex;
`

const HomeButton = styled(HomeAlt)`
  width : 24px;
  border : none;
  outline : none;
  margin : 2px;
  height : 24px;
  cursor : pointer;
`;

export default SoloRoomScreen;