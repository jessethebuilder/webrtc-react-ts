import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Room from './Room';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Room userCount={2} />
  </React.StrictMode>
);
