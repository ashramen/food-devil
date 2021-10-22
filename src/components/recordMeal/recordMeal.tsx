import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TopAppBar from '../topAppBar/topAppBar';
import { getAllFoods } from '../../api/getFoods';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';

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

interface RecordMealProps extends PropsFromRedux, RouteComponentProps {

};

interface RecordMealStates {
  allFoods: allFoods[];
};

class RecordMeal extends React.Component<RecordMealProps, RecordMealStates>{

  // call API
  async componentDidMount() {
    const allFoods: allFoods[] = await getAllFoods(this.props.token) as allFoods[];
    this.setState({
      allFoods
    })

    // testing: expect to see array of length 3130
    console.log(allFoods);
  }

  render() {
    return (
        <>
          <TopAppBar page='record meal'/>
          <h1>Record Meal</h1>
        </>
    );
  }
}

const mapStateToProps = (state: State) => ({
  loggedIn: state.logIn.loggedIn,
  username: state.logIn.username,
  token: state.logIn.token,
});

const mapDispatchToProps = {
  logIn,
  logOut
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(withRouter(RecordMeal));