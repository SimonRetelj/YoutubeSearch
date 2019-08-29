import React from 'react';
import Youtube from "./Youtube"
import './App.css';

class App extends React.Component {
  render(){
    return(
      <div>
        <header>
          <h1>Find Youtube Videos</h1>
        </header>
        <Youtube />
      </div>
      
    )
  }
}

export default App;
