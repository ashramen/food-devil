import React from 'react';
import Sidebar from '../sidebar/sidebar';

class AddMeal extends React.Component{

  render() {
    return (
        <>
          <Sidebar isLogIn={false}/>
          <h1>Add Meal</h1>
        </>
    );
  }
}

export default AddMeal;