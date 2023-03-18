import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import React from 'react';
import Login from './login';
import Signup from './signup';
import ImageView from './imageView';
import Home from './home';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navbar';

function App() {

  useEffect(() => {
    document.title = "Cloud Project";
  }, []);

  return (
    <div className="App">
      <title>File Hosting</title>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/accountview" element={<ImageView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
