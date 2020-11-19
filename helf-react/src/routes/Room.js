import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled, {createGlobalStyle} from "styled-components";
import { drawKeypoints, drawSkeleton } from "../utilities";

/* tensorflow */
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";


const videoConstraints = {

    // height : 300,
    // width : 300
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
}

const Room = (props) => {
    /* video */
    const webcamRef = useRef();
    const canvasRef = useRef();
    const Video = (props) => {
        useEffect(() => {
            props.peer.on("stream", stream => {
                webcamRef.current.srcObject = stream;
            })
        }, []);
    
        return (
<<<<<<< HEAD
            // <div className = "Webcam">
                <StyledVideo playsInline autoPlay ref={webcamRef} onClick = {(e) => {}} />
                // <canvas ref = {canvasRef} />
            // </div>
=======
            <div className = "Webcam">
                <StyledVideo playsInline autoPlay ref={webcamRef} onClick = {(e) => {ZoomVideo(e)}} />
                <canvas ref = {canvasRef} />
                <NameTag>{window.sessionStorage.name}</NameTag>
            </div>
>>>>>>> 8d4e30be3a9d51b128c490d5fc6ec3a82e16553f
            );
    } 
    /* room */
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    const detect = async (net) => {
        if(typeof userVideo !== "undefined" && typeof userVideo.current !== "undefined" && userVideo.current !== null &&
        userVideo.current.readyState === 4) {
            
            const video = userVideo.current;
            const videoWidth = userVideo.current.videoWidth;
            const videoHeight = userVideo.current.videoHeight;
            // Set video width
            userVideo.current.width = videoWidth;
            userVideo.current.height = videoHeight;
            
            // Make Detection
            const pose = await net.estimateSinglePose(video);
            console.log(pose);

            // drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);

        }
    }
    const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
    
        drawKeypoints(pose["keypoints"], 0.6, ctx);
        drawSkeleton(pose["keypoints"], 0.7, ctx);
      };
    const runPosenet = async () => {
        const net = await posenet.load({
            inputResolution:{width:300 , height:300},
            scale : 0.5
        })
        setInterval(()=> {
            detect(net)
        },100);
    }
    // runPosenet();
    useEffect(() => {
        // socketRef.current = io.connect("https://helf-node.herokuapp.com/");
        socketRef.current = io.connect("http://localhost:5000/");

        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })  
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
            socketRef.current.on('user-disconnected', (payload) => {
                const item = peersRef.current.find((p) => p.peerId === payload);
                if (item) {
                  item.peer.destroy();
                  peersRef.current = peersRef.current.filter(
                    (p) => p.peerId !== payload
                  );
                }
                setPeers((users) => users.filter((p) => p.peerId !== payload));
              });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (        
        <Container>
<<<<<<< HEAD
            {/* <button onClick={runPosenet}>Motion Detection</button> */}
            <GlobalStyle/>
        {/* <div id = "Host" > */}
            <StyledVideo id = "parent" muted ref={userVideo} autoPlay playsInline onClick = {(e) => {console.log(e)}}
        //  style={{
        //     position: "absolute",
        //     marginLeft: "auto",
        //     marginRight: "auto",
        //     left: 0,
        //     right: 0,
        //     textAlign: "center",
        //     zindex: 9,
        //     width: 640,
        //     height: 480,
        //   }} 
            />
            {/* <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        /> */}
    {/* </div> */}
            {/* <NameTag></NameTag> */}
=======
        <GlobalStyle/>
            <VideoWindow>
                <StyledVideo id = "parent" muted ref={userVideo} autoPlay playsInline onClick = {(e) => {console.log(e)}}/>
                <Canvas ref={canvasRef}/>
                <NameTag>{window.sessionStorage.name}</NameTag>    
            </VideoWindow>
>>>>>>> 8d4e30be3a9d51b128c490d5fc6ec3a82e16553f
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer}/>
                );
            })}
        </Container>
    );
};


const GlobalStyle = createGlobalStyle`
    body {
        background-color : black;
    }
`;

const Container = styled.div`
    /* display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap; */
    display:flex;
    flex-wrap : wrap;
`;

const VideoWindow = styled.div`
    display : flex;
    flex-direction : column;
    
`;

const StyledVideo = styled.video`
    /* height: 50%;
    width: 50%; */
            
    // position: "absolute",
    // marginLeft: "auto",
    // marginRight: "auto",
    // left: 0,
    // right: 0,
    // textAlign: "center",
    // zindex: 9,
    // width: 640,
    // height: 480,
`;

const Canvas = styled.div`
    position: "absolute",
    margin-left: "auto",
    margin-right: "auto",
    left: 0,
    right: 0,
    text-align: "center",
    zindex: 9,
    width: 640,
    height: 480,
`;

const NameTag = styled.h1`
    text-align:center;
    color : white;
    font-size : 20px;   
`;

export default Room;