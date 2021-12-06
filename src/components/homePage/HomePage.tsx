import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Typography from '@mui/material/Typography';

import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

interface HomePageProps extends PropsFromRedux, RouteComponentProps {};

interface HomePageStates {
}

class HomePage extends React.Component<HomePageProps, HomePageStates>{
    constructor(props: HomePageProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            this.props.history.push('/nutritionreport');
        }
    }

    render() {
        return (
            <Box height="100vh" sx={{backgroundColor: '#003087' }}>
                <Grid container justifyContent="flex-end">
                    <Button variant="text" sx={{
                        color: "white",
                        paddingTop: 3,
                        paddingRight: 3
                    }} onClick={() => {this.props.history.push('/login')}}>Log In</Button>
                </Grid>
                <Typography variant="h2" component="div" fontFamily='Apple Chancery' color='white' fontSize={100}
                    sx={{
                        paddingTop: 15,
                        paddingBottom: 10
                    }}
                >
                    Food Devil
                </Typography>
                
                <Grid container direction="column" alignItems="center" justifyContent="center">
                        <ListItemButton style={{ backgroundColor: '#003087' }} onClick={() => {this.props.history.push('/recordmeal')}}>
                            <FastfoodIcon sx={{ color: 'white', marginRight: 2, fontSize: 30 }} />
                            <ListItemText primaryTypographyProps={{ fontSize: '30px', fontFamily: 'Apple Chancery' }} primary={'View Meals'} sx={{ color: 'white' }}/>
                        </ListItemButton>
                        <ListItemButton style={{ backgroundColor: '#003087' }} onClick={() => {this.props.history.push('/restaurants')}}>
                            <RestaurantIcon sx={{ color: 'white', marginRight: 2, fontSize: 30 }}/>
                            <ListItemText primaryTypographyProps={{ fontSize: '30px', fontFamily: 'Apple Chancery' }} primary={'Browse Restaurants'} sx={{ color: 'white' }}/>
                        </ListItemButton>
                </Grid>
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
export default connector(withRouter(HomePage));