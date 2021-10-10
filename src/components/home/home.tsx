import React from 'react';
import Sidebar from '../sidebar/sidebar';
import NutritionCard from './nutritionCard';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import LockPage from '../lockPage/lockPage';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import NutritionGraph from './nutritionGraph';
import './styles.css';

interface HomeProps extends PropsFromRedux {};
interface HomeStates {
  nutrientGraphed: string;
};

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
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      nutrientGraphed: 'Calories',
    }
  }

  render() {
    const {
      nutrientGraphed
    } = this.state;
    const DV = nutritionStats[nutrientGraphed][1];
    const unit = nutritionStats[nutrientGraphed][2];
    return (
        <Box mx={2}>
          {this.props.loggedIn?
          <>
            <Sidebar isLogIn={false}/>
            <div className='titleIndent'>Daily Nutrition Report</div>
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
            <div className='title'>Nutrition History</div>
            <Divider variant='middle'/>
            <Grid container justifyContent='left' alignItems='left'>
              <Tabs
                variant='scrollable'
                scrollButtons={true}
                onChange={(event, value) => this.setState({nutrientGraphed: value})}
              >
                {Object.keys(nutritionStats).map((key: string) => {
                  const bgColor = nutrientGraphed === key? '#003087' : 'white';
                  const textColor = nutrientGraphed === key? 'white' : '#003087';
                  return (<Tab
                      value={key}
                      label={key}
                      wrapped
                      sx={{
                        fontSize: 15,
                        color: textColor,
                        bgcolor: bgColor,
                      }}
                  />)
                })}
              </Tabs>
            </Grid>
            <NutritionGraph nutrient={nutrientGraphed} numPreviousDays={7} DV={DV} unit={unit}/>
          </>: <LockPage/>}
        </Box>
    );
  }
}

const mapStateToProps = (state: State) => ({
  loggedIn: state.logIn.loggedIn,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Home);