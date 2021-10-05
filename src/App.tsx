import React from 'react';
import logo from './logo.svg';
import './App.css';
import Example from './components/example/example';
import Sidebar from './components/home/sidebar';

function App() {
  return (
    <div className="App">
      <Sidebar/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Example display = 'hello world!'/>
      </header>
    </div>
  );
}

export default App;
