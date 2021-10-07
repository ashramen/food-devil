import React from 'react';
import Sidebar from '../sidebar/sidebar';

class Home extends React.Component{

  render() {
    return (
        <>
          <Sidebar isLogIn={false}/>
          <h1>Home</h1>
        </>
    );
  }
}

export default Home;