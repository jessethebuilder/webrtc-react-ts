import React from 'react';
import './App.css';
import User from './User';

interface RoomProps {
  userCount: number
}

function Room({ userCount }: RoomProps) {
  return (
    <div className="room">
      <header className="header">
        This Room has {userCount} Users.
      </header>
    </div>
  );
}

export default Room;
