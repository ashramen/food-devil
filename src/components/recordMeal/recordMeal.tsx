import React from 'react';
import Sidebar from '../sidebar/sidebar';

class RecordMeal extends React.Component{

  render() {
    return (
        <>
          <Sidebar page='record meal'/>
          <h1>Record Meal</h1>
        </>
    );
  }
}

export default RecordMeal;