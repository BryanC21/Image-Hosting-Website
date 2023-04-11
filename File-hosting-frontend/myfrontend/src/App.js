import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import Login from './login';
import Signup from './signup';
import ImageView from './imageView';
import Home from './home';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navbar';

function App() {

  useEffect(() => {
    document.title = "Cloud Storage";
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
