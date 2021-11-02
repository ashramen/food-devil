import React from 'react';

import LockPage from '../lockPage/lockPage';
import NutritionCard from './nutritionCard';
import NutritionGraph from './nutritionGraph';
import TopAppBar from '../topAppBar/topAppBar';
import { NutritionStats } from '../../util/translateData';
import { getMealByDays } from '../../api/meals';

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
  nutritionProgress: NutritionStats;
  nutritionGraph: NutritionStats[];
  nutrientGraphed: string;
  reportDate: Date;
  historyStartDate: Date;
  historyEndDate: Date;
};

class NutritionReport extends React.Component<NutritionReportProps, NutritionReportStates>{
  constructor(props: NutritionReportProps) {
    super(props);
    this.state = {
      nutritionProgress: {'Calories': {
        intake: 0,
        DV: 2000,
        unit: 'cal'
      }},
      nutritionGraph: [],
      nutrientGraphed: 'Calories',
      reportDate: new Date(),
      historyStartDate: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)),
      historyEndDate: new Date(),
    }
  }

  async updateData() {
    // TODO: Replace 6168ce2fe182727b2d0cfe17 with actual user id
    const { userId, token } = this.props;
    const { reportDate, historyStartDate, historyEndDate } = this.state;
    const nutritionStats: NutritionStats[] = await getMealByDays('6168ce2fe182727b2d0cfe17', token, [reportDate]);
    const dateList: Date[] = [];
    for (let date = new Date(historyStartDate.getTime()); date < new Date(historyEndDate.getTime() + 24*60*60*1000); date.setDate(date.getDate() + 1)) {
        dateList.push(new Date(date.getTime()));
    };
    const nutritionGraph: NutritionStats[] = await getMealByDays('6168ce2fe182727b2d0cfe17', token, dateList);
    this.setState({
      nutritionProgress: nutritionStats[0],
      nutritionGraph,
    });
  }

  async componentDidMount() {
    if (this.props.loggedIn) {
      await this.updateData();
    }
  }

  async componentDidUpdate(prevProps: NutritionReportProps, prevStates: NutritionReportStates) {
    if (this.state.reportDate !== prevStates.reportDate
    || this.state.historyStartDate !== prevStates.historyStartDate
    || this.state.historyEndDate !== prevStates.historyEndDate) {
      this.updateData();
    }
  }

  render() {
    const {
      nutritionProgress,
      nutritionGraph,
      nutrientGraphed,
      reportDate,
      historyStartDate,
      historyEndDate,
    } = this.state;
    return (
        <Box mx={2}>
          <TopAppBar page='nutrition report'/>
          {this.props.loggedIn?
          <>
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
              {Object.keys(nutritionProgress).map((key: string) => {
                const { intake, DV, unit } = nutritionProgress[key];
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
                value={nutrientGraphed}
              >
                {Object.keys(nutritionProgress).map((key: string) => {
                  return (<Tab
                      value={key}
                      label={key}
                      wrapped
                      sx={{
                        fontSize: 15,
                      }}
                  />)
                })}
              </Tabs>
            </Grid>
            <NutritionGraph nutrient={nutrientGraphed}
              startDate={historyStartDate}
              endDate={historyEndDate} 
              intake={nutritionGraph.map((dailyInfo) => dailyInfo[nutrientGraphed].intake)}
              DV={nutritionProgress[nutrientGraphed].DV} 
              unit={nutritionProgress[nutrientGraphed].unit}
            />
          </>: <LockPage/>}
        </Box>
    );
  }
}

const mapStateToProps = (state: State) => ({
  loggedIn: state.logIn.loggedIn,
  token: state.logIn.token,
  userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(NutritionReport);