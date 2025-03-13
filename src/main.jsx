// main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Import global styles

// Function to set favicon dynamically
const setFavicon = (url) => {
  const link = document.querySelector("link[rel~='icon']");
  if (!link) {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = url;
    document.head.appendChild(newLink);
  } else {
    link.href = url;
  }
};

// Set the favicon
setFavicon("/favcon.png");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
