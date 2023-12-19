import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import adapter from "webrtc-adapter";

interface UserProps {
  readonly callerType: string;
  callState: string;
}

function User({ callerType, callState }: UserProps) {
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

  useEffect(() => {
    switch (callState) {
      case "start":
        if (callerType === "me") { start(); }
        break;
      case "end":
      if (callerType === "me") { end(); }
      break;
    };
  }, [callState]);

  return (
    <div className="user">
      <video ref={video} playsInline={true} autoPlay={true}></video>
    </div>
  );
}

export default User;
