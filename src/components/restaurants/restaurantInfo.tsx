import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from "react-router-dom";

import { State } from '../../store/index';
import TopAppBar from '../topAppBar/topAppBar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';


import RestaurantReviewTable from './restaurantReviewTable';
import MealsOrdered from './mealsOrdered';

import './styles.css';

interface MatchParams {
    id: string;
}

interface RestaurantInfoProps extends PropsFromRedux, RouteComponentProps<MatchParams> {
    name: string;
}



class RestaurantInfo extends React.Component<RestaurantInfoProps, any> {

    constructor(props: RestaurantInfoProps) {
        super(props)
    }

    render() {

        const { name } = this.props;
        return (
            <Box mx={2}>
                <>
                    <TopAppBar page='restaurants' />
                    <Grid container mt={15}>
                        <Grid item xs={6}>
                            <div className='title'>{this.props.match.params.id} (2.5 stars)</div>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography align="right">
                                <Link to={"/restaurants"}>
                                    <Button>Go Back</Button>
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid container direction="row" spacing={2} alignItems="flex-start" >
                            <Grid item container direction="column" xs spacing={2}>
                                <Grid item xs>
                                    <div style={{ fontSize: 30 }}> Previous Reviews </div>
                                </Grid>
                                <Grid item xs>
                                    <RestaurantReviewTable name={name} />
                                </Grid>
                            </Grid>
                            <Grid item container direction="column" xs spacing={2}>
                                <Grid item xs>
                                    <img
                                        className='image'
                                        src="https://eventservices.duke.edu/sites/default/files/styles/dws_feature_image/public/thumbnails/image/SazonLatinKitchen.jpg?itok=XRzHPxDz"
                                        alt="new"
                                    />
                                </Grid>
                                <Grid item xs>
                                    <div style={{ fontSize: 30 }}> Meals You've Ordered From Here </div>
                                </Grid>
                                <Grid item xs>
                                    <MealsOrdered name={name} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            </Box >
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
export default (connector(RestaurantInfo));
