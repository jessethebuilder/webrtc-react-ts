import React, { useState, useRef, useEffect } from "react";
import adapter from "webrtc-adapter";
import "./App.css";
import User from "./User";

type ConnectionData = {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

interface RoomProps {
  userCount: number,
}

function Room({ userCount }: RoomProps) {
  const [callState, setCallState] = useState<string>("waiting");
  const startButton = useRef<HTMLButtonElement>(document.createElement('button'));
  const endButton = useRef<HTMLButtonElement>(document.createElement('button'));
  const peerConnection = useRef() as React.MutableRefObject<RTCPeerConnection | null>;

  async function createPeerConnection() {
    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate) {
        const data: ConnectionData = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex
        }

        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(data);
        }
      } else {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate({});
        }
      }

      setCallState('connected');
    };

    peerConnection.current.ontrack = (event) => {
      alert(event.streams[0]);
      // remoteVideo.srcObject = event.streams[0];

    }
  }

  async function makeCall() {
    await createPeerConnection();

    if (peerConnection.current) {
      const offer = await peerConnection.current.createOffer();
      peerConnection.current.setLocalDescription(offer);
    }
  }

  async function handleOffer(offer: string | undefined) {
    // This needs to be called only in the window that makes the offer
    await createPeerConnection();

    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription({
        type: 'offer',
        sdp: offer
      });
    }
  }

  async function handleAnswer() {
    // This needs to be called only in the window that gets the offer

    if (peerConnection.current) {
      const answer = await peerConnection.current.createAnswer();

      await peerConnection.current.setRemoteDescription({
        type: 'answer',
        sdp: answer.sdp
      });

      await peerConnection.current.setLocalDescription(answer);
    }
  }

  function endCall() {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  }

  useEffect(() => {
    switch (callState) {
      case "start":
        startButton.current.disabled = true;
        endButton.current.disabled = false;

        if (peerConnection.current) { return; }

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

      <User callerType="me" callState={callState} peerConnection={peerConnection.current} />

      <button ref={startButton} onClick={(event) => setCallState("start")}>Start</button>
      <button ref={endButton} onClick={(event) => setCallState("end")}>End</button>

      <User callerType="you" callState={callState} peerConnection={peerConnection.current} />
    </div>
  );
}


export default Room;
