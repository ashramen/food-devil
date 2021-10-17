import React from 'react';

import Sidebar from '../sidebar/sidebar';
import { getAllFoods } from '../../API/getFoods';

interface allFoods {
  _id: string;
  restaurantId: string;
  menu: string;
  submenu: string;
  name: string;
  allergens: string[];
  ingredients: string | null;
  serving_size: string;
  servings_per_container: string;
  total_cal: number;
  fat_g: number;
  sat_fat_g: number;
  trans_fat_g: number;
  chloestrol_mg: number;
  sodium_mg: number;
  carbs_g: number;
  fiber_g: number;
  sugars_g: number;
  protein_g: number;
}

interface RecordMealProps {

};

interface RecordMealStates {
  allFoods: allFoods[];
};

class RecordMeal extends React.Component<RecordMealProps, RecordMealStates>{

  // call API
  async componentDidMount() {
    const allFoods: allFoods[] = await getAllFoods() as allFoods[];
    this.setState({
      allFoods
    })

    // testing: expect to see array of length 3130
    console.log(allFoods);
  }

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