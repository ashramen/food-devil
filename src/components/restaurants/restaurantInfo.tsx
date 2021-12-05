import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from "react-router-dom";

import { State } from '../../store/index';
import TopAppBar from '../topAppBar/topAppBar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CardMedia, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';

import { nameToImage } from './restaurantBox';
import RestaurantReviewTable from './restaurantReviewTable';
import RestaurantReviewField from './restaurantReviewField';
import MealsOrdered from './mealsOrdered';

import './styles.css';

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
            <Box mx={2}>
                <>
                    <TopAppBar page='restaurants' />
                    <Grid container mt={15}>
                        <Grid item xs={6}>
                            {averageRating > 0
                                ? <div className='title'>
                                    {name} (<Rating name='restaurant-average-rating' value={averageRating} precision={0.1} size="large" readOnly />)
                                </div>
                                : <div className='title'>
                                    {name} (no average rating)
                                </div>
                            }
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
                                    <RestaurantReviewTable name={name} id={id} handleAverageRatingChange={newValue => this.handleAverageRatingChange(newValue)} />
                                </Grid>

                                <Grid item xs>
                                    <div style={{ fontSize: 30 }}> Write A Review </div>
                                </Grid>
                                {this.props.loggedIn ?
                                    <Grid item xs>
                                        <RestaurantReviewField name={name} id={id} />
                                    </Grid>
                                    : <div> Please login to write a review! </div>
                                }
                            </Grid>
                            <Grid item container direction="column" xs spacing={2}>
                                <Grid item xs>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={nameToImage[name]}
                                        alt={name}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <div style={{ fontSize: 30 }}> Meals You've Ordered From {name} </div>
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
