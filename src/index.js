import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LogInicioSesion from './pages/logsInicioSesion';
import {BrowserRouter as Router,Route, Routes} from "react-router-dom";


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
             <Route path="/" element={<App />} />
             <Route path="/logsInicioSesion" element={<LogInicioSesion />} />
      </Routes>

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

