import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled, {createGlobalStyle} from "styled-components";

// /* tensorflow */
// import * as tf from "@tensorflow/tfjs";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam";

function ZoomVideo(video){
    // // console.log(video);
    // console.log(video.current.clientHeight)
}

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} onClick = {ZoomVideo(ref)}/>
    );
}

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    useEffect(() => {
        socketRef.current = io.connect("https://helf-node.herokuapp.com/");
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
            <GlobalStyle/>
            <StyledVideo id = "parent" muted ref={userVideo} autoPlay playsInline onClick = {(e) => {console.log(e)}} />
            {/* <NameTag></NameTag> */}
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


const StyledVideo = styled.video`
    height: 50%;
    width: 50%;
`;


export default Room;