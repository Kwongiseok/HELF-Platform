import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

/* tensorflow */
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
// import {drawKeypoints, drawSkeleton} from "../utilities"

const Container = styled.div`
    /* display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap; */
    display:flex;
    flex-wrap : wrap;
`;

const StyledVideo = styled.video`
    height: 300px;
    width: 300px;
`;

function ZoomVideo(peerID){
    console.log(peerID);
    alert("dd");
}

// const runPosenet = async () => {
//     const net = await posenet.load({
//         inputResolution:{width: "50%" , height:"50%"},
//         scale : 0.5
//     })
//     setInterval(()=> {
//         detect(net)
//     },100);

// }
/* posenet */

// const Video = (props) => {
//     webcamRef = useRef();
//     canvasRef = useRef();
//     useEffect(() => {
//         props.peer.on("stream", stream => {
//             webcamRef.current.srcObject = stream;
//         })
//     }, []);

//     return (
//         <div className = "Webcam">
//             <StyledVideo playsInline autoPlay ref={webcamRef} onClick = {(e) => {ZoomVideo(e)}} />
//             <canvas ref = {canvasRef} />
//         </div>
//         );
// } 

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


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
            <div className = "Webcam">
                <StyledVideo playsInline autoPlay ref={webcamRef} onClick = {(e) => {ZoomVideo(e)}} />
                <canvas ref = {canvasRef} />
            </div>
            );
    } 
    /* room */
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    const detect = async (net) => {
        if(typeof webcamRef !== "undefined" && typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
            console.log('detect 실행');
            
            const video = webcamRef.current.srcObject;
            console.log(video)
            // const videoWidth = webcamRef.current.srcObject.videoWidth;
            // const videoHeight = webcamRef.current.srcObject.videoHeight;
            // Set video width
            // webcamRef.current.srcObject.width = videoWidth;
            // webcamRef.current.srcObject.height = videoHeight;
            
            // Make Detection
            const pose = await net.estimateSinglePose(webcamRef);
            console.log(pose);
        }
    }
    const runPosenet = async () => {
        console.log('u')
        const net = await posenet.load({
            inputResolution:{width:300 , height:300},
            scale : 0.5
        })
        setInterval(()=> {
            detect(net)
        },100);
    }
    runPosenet();
    useEffect(() => {
        socketRef.current = io.connect("https://helf-node.herokuapp.com/");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            console.log(userVideo)
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
    // console.log(peers.length)
    console.log(peers);

    return (
        <Container>
            <StyledVideo id = "parent" muted ref={userVideo} autoPlay playsInline onClick = {(e) => {console.log(e)}} />
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer}/>
                );
            })}
        </Container>
    );
};


export default Room;