import React from 'react';

import LockPage from '../lockPage/lockPage';
import NutritionCard from './nutritionCard';
import NutritionGraph from './nutritionGraph';
import Sidebar from '../sidebar/sidebar';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

import './styles.css';

interface NutritionReportProps extends PropsFromRedux {};
interface NutritionReportStates {
  nutrientGraphed: string;
  reportDate: Date;
  historyStartDate: Date;
  historyEndDate: Date;
};

interface NutritionStats {
  [x: string]: [number, number, string];
}

// TODO: create a function that retrieves this data on a certain day
const nutritionStats: NutritionStats = {
  'Calories': [0, 2300, 'cal'],
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

class NutritionReport extends React.Component<NutritionReportProps, NutritionReportStates>{
  constructor(props: NutritionReportProps) {
    super(props);
    this.state = {
      nutrientGraphed: 'Calories',
      reportDate: new Date(),
      historyStartDate: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)),
      historyEndDate: new Date(),
    }
  }

  render() {
    const {
      nutrientGraphed,
      reportDate,
      historyStartDate,
      historyEndDate,
    } = this.state;
    const DV = nutritionStats[nutrientGraphed][1];
    const unit = nutritionStats[nutrientGraphed][2];
    return (
        <Box mx={2}>
          {this.props.loggedIn?
          <>
            <Sidebar page='nutrition report'/>
            <Grid container mt={15}>
              <Grid item xs={6}>
                <div className='title'>Daily Nutrition Report</div>
              </Grid>
              <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Date'
                    value={reportDate}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({reportDate: newDate? newDate : new Date()})
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Divider variant='middle'/>
            <Grid container justifyContent='center'>
              {Object.keys(nutritionStats).map((key: string) => {
                const [intake, DV, unit] = nutritionStats[key];
                return (<Grid item xs={2}>
                  <NutritionCard nutrient={key} currentStats={intake} DV={DV} unit={unit} date={reportDate}/>
                </Grid>)
              })}
            </Grid>
            <Grid container mt={2}>
              <Grid item xs={6}>
                <div className='title'>Nutrition History</div>
              </Grid>
              <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Start Date'
                    value={historyStartDate}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({
                        historyStartDate: newDate? newDate : new Date(),
                        historyEndDate: newDate && newDate > historyEndDate? newDate : historyEndDate,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label='End Date'
                    value={historyEndDate}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({
                        historyEndDate: newDate? newDate : new Date(),
                        historyStartDate: newDate && newDate < historyStartDate? newDate : historyStartDate,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
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
            <NutritionGraph nutrient={nutrientGraphed} startDate={historyStartDate} endDate={historyEndDate} DV={DV} unit={unit}/>
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
export default connector(NutritionReport);