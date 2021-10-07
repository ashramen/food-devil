import React from 'react';
import Sidebar from '../sidebar/sidebar';

class Restaurants extends React.Component{

  render() {
    return (
        <>
          <Sidebar isLogIn={false}/>
          <h1>Restaurants</h1>
        </>
    );
  }
}

export default Restaurants;