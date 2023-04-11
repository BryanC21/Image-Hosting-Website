import './App.css';
import React from 'react';

function Home() {

  console.log(process.env.REACT_APP_BASE_URL);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Image Upload Tool
        </h1>
        <p>Created by: Bryan Caldera</p>
        <br />
        <p>To get started just click sign up above</p>
        <br/>
        <p>Upload an image </p>
        <p>View your images </p>
        <p>Delete your images </p>

        <div className=''>
        <a href="https://github.com/BryanC21/">Github</a>
        <br />
        <a href="https://bcaldera.com/">Personal Site</a>
      </div>

      </header>
    </div>
  );
}

export default Home;
