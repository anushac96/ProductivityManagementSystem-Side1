import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import './index.css';
import reportWebVitals from './reportWebVitals';
import SignIn from './SignIn'; // Import SignIn
import SignUp from './SignUp';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

// Use ReactDOM.render instead of ReactDOM.createRoot
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/signup" element={<SignUp />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root') // Render to the root element
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
