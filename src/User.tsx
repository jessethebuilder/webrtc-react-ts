import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import adapter from "webrtc-adapter";

interface UserProps {
  readonly callerType: string;
  callState: string;
  peerConnection: RTCPeerConnection | null
}

function User({ callerType, callState, peerConnection }: UserProps) {
  const video = useRef<HTMLVideoElement>(document.createElement("video"));
  const localStream = useRef() as React.MutableRefObject<MediaStream>;

  async function start () {
    localStream.current = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
    video.current.srcObject = localStream.current;
  }

  async function end() {
    localStream.current.getTracks().forEach(track => track.stop());
    video.current.srcObject = null;
  }

  async function connectLocalStream() {
    if (!peerConnection) { return };

    localStream.current.getTracks().forEach( (track) => {
      peerConnection.addTrack(track, localStream.current);
    });
  }

  useEffect(() => {
    if (callerType === "me") {
      switch (callState) {
        case "start":
          start()
          break;
        case 'connected':
          connectLocalStream();
          break;
        case "end":
          end();
          break;
      };
    }
  }, [callState]);

  return (
    <div className="user">
      <video ref={video} playsInline={true} autoPlay={true}></video>
    </div>
  );
}

export default User;
