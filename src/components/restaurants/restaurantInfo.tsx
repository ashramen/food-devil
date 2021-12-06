import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from "react-router-dom";

import { State } from '../../store/index';
import TopAppBar from '../topAppBar/topAppBar';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CardMedia, Divider, IconButton, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';

import { nameToImage } from './restaurantBox';
import RestaurantReviewTable from './restaurantReviewTable';
import RestaurantReviewField from './restaurantReviewField';
import MealsOrdered from './mealsOrdered';

import './styles.css';
import AddIcon from "@mui/icons-material/Add";

interface MatchParams {
    name: string;
    id: string;
}

interface RestaurantInfoProps extends PropsFromRedux, RouteComponentProps<MatchParams> {
    name: string;
    id: string;
}

interface RestaurantInfoState {
    averageRating: number
}

class RestaurantInfo extends React.Component<RestaurantInfoProps, RestaurantInfoState> {

    constructor(props: RestaurantInfoProps) {
        super(props);
        this.state = {
            averageRating: 0
        };
        // this.handleAverageRatingChange = this.handleAverageRatingChange.bind(this);
    }

    handleAverageRatingChange(newValue: number) {
        this.setState({
            averageRating: newValue
        })
    }

    render() {

        const { name, id } = this.props.match.params;
        const averageRating = this.state.averageRating;
        return (
            <Box mx={2} sx={{marginBottom: 3}}>
                <>
                    <TopAppBar page='restaurants' />
                    <Grid container mt={15}>
                        <Grid item>
                            {averageRating > 0
                                ? <div className='title'>
                                    {name} (<Rating name='restaurant-average-rating' value={averageRating} precision={0.1} size="large" readOnly />)
                                </div>
                                : <div className='title'>
                                    {name} (no average rating)
                                </div>
                            }
                        </Grid>
                        <Grid item marginLeft="auto">
                            <Typography align="right">
                                <Link to={"/restaurants"}>
                                    <IconButton size="large">
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container>
                        <Grid item container direction="column" xs style={{ display: "flex", justifyContent: "flex-start" }}>
                            <Grid item xs mt={2}>
                                <div style={{ fontSize: 25 }}> Write A Review </div>
                            </Grid>
                            {this.props.loggedIn ?
                                <Grid item xs>
                                    <RestaurantReviewField name={name} id={id} />
                                </Grid>
                                : <div> Please login to write a review! </div>
                            }
                            <Divider  sx={{marginTop: 3, marginBottom: 1}}/>
                            <Grid item xs mt={1}>
                                <div style={{ fontSize: 25 }}> Previous Reviews </div>
                            </Grid>
                            <Grid item xs>
                                <RestaurantReviewTable name={name} id={id} handleAverageRatingChange={newValue => this.handleAverageRatingChange(newValue)} />
                            </Grid>
                            <Divider sx={{marginTop: 4}}/>
                            <Grid item container direction="column" xs spacing={2} mt={1}>
                                <Grid item xs>
                                    <div style={{ fontSize: 25 }}> Meals You've Ordered From {name} </div>
                                </Grid>
                                {this.props.loggedIn ?
                                    <Grid item xs>
                                        <MealsOrdered id={id} name={name} />
                                    </Grid>
                                    : <div> Please login to view meals you've ordered with </div>}
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
