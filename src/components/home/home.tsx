import React from 'react';
import Sidebar from '../sidebar/sidebar';
import NutritionCard from './nutritionCard';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LockPage from '../lockPage/lockPage';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import './styles.css';

interface HomeProps extends PropsFromRedux {};
interface HomeStates {};

interface NutritionStats {
  [x: string]: [number, number, string];
}

const nutritionStats: NutritionStats = {
  'Calories': [1800, 2300, 'cal'],
  'Sugar': [28, 36, 'g'],
  'Salt': [8, 6, 'g'],
  'Calcium': [1000, 2500, 'mg'],
  'Sodium': [2500, 3400, 'mg'],
  'Vitamin A': [1000, 900, 'mg'],
  'Vitamin B-12': [1.1, 2.4, 'mg'],
  'Vitamin C': [78, 80, 'mg'],
  'Fat': [20, 50, 'g'],
  'Carbohydrates': [240, 300, 'g'],
  'Protein': [44, 50, 'g'],
  'Water': [8, 8, 'cups'],
}

class Home extends React.Component<HomeProps, HomeStates>{
  render() {
    return (
        <>
          {this.props.loggedIn?
          <>
            <Sidebar isLogIn={false}/>
            <div className='title'>Daily Nutrition Report</div>
            <Divider variant='middle'/>
            <Grid container alignItems='center' direction='column'>
              <Grid container justifyContent='center' alignItems='center'>
                {Object.keys(nutritionStats).map((key: string) => {
                  const [intake, DV, unit] = nutritionStats[key];
                  return (<Grid item xs={2}>
                    <NutritionCard nutrient={key} currentStats={intake} DV={DV} unit={unit}/>
                  </Grid>)
                })}
              </Grid>
            </Grid>
          </>: <LockPage/>}
        </>
    );
  }
}

const mapStateToProps = (state: State) => ({
  loggedIn: state.logIn.loggedIn,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Home);