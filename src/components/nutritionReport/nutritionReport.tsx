import React from 'react';

import LockPage from '../lockPage/lockPage';
import NutritionCard from './nutritionCard';
import NutritionGraph from './nutritionGraph';
import TopAppBar from '../topAppBar/topAppBar';
import { NutritionStats } from '../../util/translateData';
import { getMealByDays } from '../../api/meals';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
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

interface NutritionReportProps extends PropsFromRedux { };
interface NutritionReportStates {
  nutritionProgress: NutritionStats;
  nutritionGraph: NutritionStats[];
  nutrientGraphed: string;
  reportDate: Date;
  historyStartDate: Date;
  historyEndDate: Date;
  loadingReport: boolean;
  loadingGraph: boolean;
};

class NutritionReport extends React.Component<NutritionReportProps, NutritionReportStates>{
  constructor(props: NutritionReportProps) {
    super(props);
    this.state = {
      nutritionProgress: {
        'Calories': {
          intake: 0,
          DV: 2000,
          unit: 'cal'
        }
      },
      nutritionGraph: [],
      nutrientGraphed: 'Calories',
      reportDate: new Date(),
      historyStartDate: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)),
      historyEndDate: new Date(),
      loadingReport: true,
      loadingGraph: true
    }
  }

  async updateData(updating: string) {
    const { userId, token } = this.props;
    const { reportDate, historyStartDate, historyEndDate } = this.state;
    if (updating === 'report' || updating === 'both') {
      this.setState({ loadingReport: true });
      const nutritionStats: NutritionStats[] = await getMealByDays(userId!, token, [reportDate]);
      this.setState({ nutritionProgress: nutritionStats[0], loadingReport: false });
    }
    if (updating === 'graph' || updating === 'both') {
      this.setState({ loadingGraph: true });
      const dateList: Date[] = [];
      for (let date = new Date(historyStartDate.getTime()); date < new Date(historyEndDate.getTime() + 24 * 60 * 60 * 1000); date.setDate(date.getDate() + 1)) {
        dateList.push(new Date(date.getTime()));
      };
      const nutritionGraph: NutritionStats[] = await getMealByDays(userId!, token, dateList);
      this.setState({ nutritionGraph, loadingGraph: false });
    }
  }

  async componentDidMount() {
    if (this.props.loggedIn) {
      await this.updateData('both');
    }
  }

  async componentDidUpdate(prevProps: NutritionReportProps, prevStates: NutritionReportStates) {
    if (this.state.reportDate !== prevStates.reportDate) {
      this.updateData('report')
    } else if (this.state.historyStartDate !== prevStates.historyStartDate
      || this.state.historyEndDate !== prevStates.historyEndDate) {
      this.updateData('graph');
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
      loadingReport,
      loadingGraph
    } = this.state;
    return (
      <Box mx={2}>
        <TopAppBar page='nutrition report' />
        {this.props.loggedIn ?
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
                      this.setState({ reportDate: newDate ? newDate : new Date() })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Divider variant='middle' />
            {loadingReport? <CircularProgress size={100} sx={{ marginTop: 27.25, marginBottom: 27.25}}/> :
            <Grid container justifyContent='center'>
              {Object.keys(nutritionProgress).map((key: string, index: number) => {
                const { intake, DV, unit } = nutritionProgress[key];
                return (<Grid item xs={2}>
                  <NutritionCard nutrient={key} currentStats={intake} DV={DV} unit={unit} date={reportDate} index={index} />
                </Grid>)
              })}
            </Grid>}
            <Grid container mt={2}>
              <Grid item xs={6}>
                <div className='title'>Nutrition History</div>
              </Grid>
              <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label='Start Date'
                    value={historyStartDate}
                    minDate={new Date(historyEndDate.getTime() - (14 * 24 * 60 * 60 * 1000))}
                    maxDate={new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({
                        historyStartDate: newDate ? newDate : new Date(),
                        historyEndDate: newDate && newDate > historyEndDate ? newDate : historyEndDate,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label='End Date'
                    value={historyEndDate}
                    maxDate={new Date() > new Date(historyStartDate.getTime() + (14 * 24 * 60 * 60 * 1000))? new Date(historyStartDate.getTime() + (30 * 24 * 60 * 60 * 1000)) : new Date()}
                    onChange={(newDate: Date | null) => {
                      this.setState({
                        historyEndDate: newDate ? newDate : new Date(),
                        historyStartDate: newDate && newDate < historyStartDate ? newDate : historyStartDate,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Divider variant='middle' />
            <Grid container justifyContent='left' alignItems='left'>
              <Tabs
                variant='scrollable'
                scrollButtons={true}
                onChange={(event, value) => this.setState({ nutrientGraphed: value })}
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
            {loadingGraph? <CircularProgress size={100} sx={{ marginTop: 24, marginBottom: 24}}/> :
            <NutritionGraph nutrient={nutrientGraphed}
              startDate={historyStartDate}
              endDate={historyEndDate}
              intake={nutritionGraph.map((dailyInfo) => dailyInfo[nutrientGraphed].intake)}
              DV={nutritionProgress[nutrientGraphed].DV}
              unit={nutritionProgress[nutrientGraphed].unit}
            />}
          </> : <LockPage />}
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