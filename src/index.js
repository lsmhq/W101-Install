import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "@arco-design/web-react/dist/css/arco.css";
const root = ReactDOM.createRoot(document.getElementById('root'));
const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

darkThemeMq.addListener(e => {
 if (e.matches) {
   document.body.setAttribute('arco-theme', 'dark');
 } else {
    document.body.removeAttribute('arco-theme');
  }
});
root.render(<App />);

reportWebVitals();
