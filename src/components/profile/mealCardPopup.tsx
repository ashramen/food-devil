import React from 'react';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { connect, ConnectedProps } from 'react-redux';
import RestaurantReviewField from '../restaurants/restaurantReviewField';
import { State } from '../../store/index';

import * as MC from './mealCardSplit';

interface RestaurantsReviewPopupProps extends PropsFromRedux {
    mealsPerRestaurant: MC.IMealData;
    handleClose: any;
    open: boolean;
}

class MealCardPopup extends React.Component<RestaurantsReviewPopupProps> {

    render() {

        const { mealsPerRestaurant, handleClose, open } = this.props;

        return (
            <Dialog onClose={handleClose} open={open}>
                <Grid container>
                    {Object.keys(mealsPerRestaurant).map((rest) => 
                        <Grid container columns={2} direction='row'>
                            <Grid item>
                                <div>{rest}</div>
                            </Grid>
                            <Grid container>
                                {mealsPerRestaurant[rest].foods.map((food) =>
                                    <Grid item>
                                    <div>{food}</div>
                                </Grid>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Dialog >
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
export default connector(MealCardPopup);
