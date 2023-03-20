import './App.css';
import React from 'react';

function Home() {

  console.log(process.env.REACT_APP_BASE_URL);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Image Upload Tool!
        </h1>
        <p>Created by: Bryan Caldera</p>
        <a href="https://github.com/BryanC21/">Github</a>
        <a href="https://bcaldera.com/">Personal Site</a>
        <br/>
        <p>To get started just click <a href="/signup">Sign up</a></p>
        <p>Create a Username and Password (Passwords Not Encrypted At Rest) </p>
        <br/>
        <p>Upload an image </p>
        <p>View your images </p>
        <p>Update your images </p>
        <p>Delete your images </p>

      </header>
    </div>
  );
}

export default Home;
