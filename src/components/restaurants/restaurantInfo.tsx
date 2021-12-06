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
import Rating from '@mui/material/Rating';

import RestaurantReviewTable from './restaurantReviewTable';
import MealsOrdered from './mealsOrdered';
import RestaurantsReviewPopup from './restaurantReviewPopup';
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
    dialogOpen: boolean
}

class RestaurantInfo extends React.Component<RestaurantInfoProps, RestaurantInfoState> {

    constructor(props: RestaurantInfoProps) {
        super(props);
        this.state = {
            averageRating: 0,
            dialogOpen: false
        };
        this.onWriteAReviewClick = this.onWriteAReviewClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.handleAverageRatingChange = this.handleAverageRatingChange.bind(this);
    }

    handleAverageRatingChange(newValue: number) {
        this.setState({
            averageRating: newValue
        })
    }

    onWriteAReviewClick() {
        this.setState({ dialogOpen: true });
    }

    handleClose() {
        this.setState({ dialogOpen: false })
    }

    render() {

        const { name, id } = this.props.match.params;
        const { dialogOpen } = this.state;
        const averageRating = this.state.averageRating;
        return (
            <>
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
                            <Grid item container direction="column" xs style={{ display: "flex", justifyContent: "flex-start" }}>
                                <Grid item xs mt={1}>
                                    <div style={{ fontSize: 25, fontFamily: 'Open Sans' }}> Previous Reviews {this.props.loggedIn ?
                                        <Grid item xs>
                                            <Button onClick={() => this.onWriteAReviewClick()}>Write a Review</Button>
                                        </Grid>
                                        : <div> Please login to write a review! </div>
                                    } </div>
                                </Grid>
                                <Grid item xs>
                                    <RestaurantReviewTable name={name} id={id} handleAverageRatingChange={newValue => this.handleAverageRatingChange(newValue)} />
                                </Grid>
                                <Grid item container direction="column" xs spacing={2} mt={1}>
                                    <Grid item xs>
                                        <div style={{ fontSize: 25, fontFamily: 'Open Sans' }}> Meals You've Ordered From {name} </div>
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
                <RestaurantsReviewPopup name={name} handleClose={this.handleClose} open={dialogOpen} id={id} />
            </>
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
