import React, { useState, useRef, useEffect } from "react";
import adapter from "webrtc-adapter";
import "./App.css";
import User from "./User";

interface RoomProps {
  userCount: number,
}

// let <RTCPeerConnection | null>peerConnection = null;
// const peerConnection = new RTCPeerConnection();

function Room({ userCount }: RoomProps) {
  const [callState, setCallState] = useState("waiting");
  const startButton = useRef<HTMLButtonElement>(document.createElement('button'));
  const endButton = useRef<HTMLButtonElement>(document.createElement('button'));
  // const peerConnection = useRef() as React.MutableRefObject<RTCPeerConnection | null>;

  async function createPeerConnection() {
    const peerConnection = new RTCPeerConnection();
    // peerConnection.current = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      const candidateData = {};

      if (event.candidate) {
        candidateData.candidate = event.candidate.candidate;
        candidateData.sdpMid = event.candidate.sdpMid;
        candidateData.sdpMLineIndex = event.candidate.sdpMLineIndex;
      }
    };

    // peerConnection.ontrack = () => {
    //   remoteVideo.srcObject = event.streams[0];
    // }

    // localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  }

  async function makeCall() {
    await createPeerConnection();
  }

  function endCall() {
    peerConnection.current = null;
  }

  useEffect(() => {
    switch (callState) {
      case "start":
        startButton.current.disabled = true;
        endButton.current.disabled = false;
        makeCall();
        break;
      case "end":
        startButton.current.disabled = false;
        endButton.current.disabled = true;
        endCall();
        break;
      case "waiting":
        startButton.current.disabled = false;
        endButton.current.disabled = true;
        break;
    }
  }, [callState]);

  return (
    <div className="room">
      <header className="header">
        This Room has {userCount} Users.
      </header>

      <User callerType="me" callState={callState} />

      <button ref={startButton} onClick={(event) => setCallState("start")}>Start</button>
      <button ref={endButton} onClick={(event) => setCallState("end")}>End</button>
    </div>
  );
}


export default Room;
