import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import './phaserGame';
import reportWebVitals from './utilities/reportWebVitals';

export const main = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

main.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
