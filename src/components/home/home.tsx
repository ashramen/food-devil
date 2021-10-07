import React from 'react';
import Sidebar from './sidebar';

class Home extends React.Component{

  render() {
    return (
        <div>
          <Sidebar/>
          <h1>Home</h1>
        </div>
    );
  }
}

export default Home;