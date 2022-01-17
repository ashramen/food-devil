import React from 'react';

import LockPage from '../lockPage/lockPage';
import NutritionCard from './nutritionCard';
import NutritionGraph from './nutritionGraph';
import TopAppBar from '../topAppBar/topAppBar';
import { NutritionStats } from '../../util/translateData';
import { getMealNutritionByDays } from '../../api/meals';

import {Button, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Zoom } from "@mui/material";
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
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import { ColorizeSharp } from '@mui/icons-material';


//import './styles.css';

interface NutritionReportProps extends PropsFromRedux, RouteComponentProps { };
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

class ExportPage extends React.Component<NutritionReportProps, NutritionReportStates>{
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
      // 6 days back from the current time 
      historyStartDate: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)),
      historyEndDate: new Date(),
      loadingReport: true,
      loadingGraph: true
    }
  }

  async updateData(updating: string) {
    console.log('ran')
    const { userId, token } = this.props;
    const { reportDate, historyStartDate, historyEndDate } = this.state;
    if (updating === 'report' || updating === 'both') {
      this.setState({ loadingReport: true });
      const nutritionStats: NutritionStats[] = await getMealNutritionByDays(userId!, token, [reportDate]);
      this.setState({ nutritionProgress: nutritionStats[0], loadingReport: false });
    }
    if (updating === 'graph' || updating === 'both') {
      this.setState({ loadingGraph: true });
      const dateList: Date[] = [];
      for (let date = new Date(historyStartDate.getTime()); date < new Date(historyEndDate.getTime() + 24 * 60 * 60 * 1000); date.setDate(date.getDate() + 1)) {
        dateList.push(new Date(date.getTime()));
      };
      let nutritionGraph: NutritionStats[] = await getMealNutritionByDays(userId!, token, dateList);

      let arr: any = nutritionGraph;
      let len = arr.length;
      let date = new Date(historyStartDate)
      console.log(date)
      for (let i=0; i<len; i++){
        const dayObj = arr[i];
        const keys = Object.keys(dayObj)
        
        keys.forEach(key => {
          dayObj[key + " unit"] = dayObj[key].unit;
          dayObj[key] = dayObj[key].intake;
        })
        let sorted = Object.keys(dayObj)
                    .sort()
                    .reduce((acc, key) => ({
                        ...acc, [key]: dayObj[key]
                    }), {})
        arr[i] = {'date': formatDate(date), ...sorted}
        date.setDate(date.getDate() + 1)
        
      }
      
      this.setState({ nutritionGraph, loadingGraph: false });
    }
  }

  async componentDidMount() {
    if (this.props.loggedIn) {
      await this.updateData('both');
      console.log('graph updated bc login')
    } else {
      this.props.history.push('/')
    }
  }

  async componentDidUpdate(prevProps: NutritionReportProps, prevStates: NutritionReportStates) {
    if (this.state.reportDate !== prevStates.reportDate) {
      this.updateData('report')
    } else if (this.state.historyStartDate !== prevStates.historyStartDate
      || this.state.historyEndDate !== prevStates.historyEndDate) {
      this.updateData('graph');
      console.log('graph updated')
    } else if (this.props.loggedIn !== prevProps.loggedIn) {
      this.props.history.push('/')
    }
  }

  async downloadCSV() {
    const { reportDate, historyStartDate, historyEndDate, nutritionGraph} = this.state;
    const options = { 
      fieldSeparator: ',',
      filename: 'Nutrition from ' + formatDate(historyStartDate) + ' to ' + formatDate(historyEndDate),
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false, 
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(nutritionGraph);
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
        <>
            <Box  mx={2}>
                <TopAppBar page='export' />

                <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end", gap: 8}} mb={1}>
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
                    <>
                    {loadingGraph? <CircularProgress size={100} sx={{ marginTop: 24, marginBottom: 24}}/> :
                    <Button variant='contained' onClick={() => this.downloadCSV()} sx={{bgcolor: '#003087'}}>
                    Export Nutrition History
                    </Button>
                    }
                        
                    </>
            </Box>
        </>
    );
  }
}

function processStats(arr: any) {
  let len = arr.length;
  for (let i=0; i<len; i++){
    const dayObj = arr[i];
    const keys = Object.keys(dayObj)
    keys.forEach(key => {
      dayObj[key + " unit"] = dayObj[key].unit;
      dayObj[key] = dayObj[key].intake;
    })
  }
  return arr;
}

function formatDate(date: any) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}


const mapStateToProps = (state: State) => ({
  loggedIn: state.logIn.loggedIn,
  token: state.logIn.token,
  userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(withRouter(ExportPage));