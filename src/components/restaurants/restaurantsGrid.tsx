import React from 'react';

import RestaurantBox from './restaurantBox';
import Grid from '@mui/material/Grid';


class RestaurantsGrid extends React.Component {

    render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <RestaurantBox name="Sazon" description="hello" />
                </Grid>
                <Grid item xs={4}>
                    <RestaurantBox name="Sazon" description="hello" />
                </Grid>
                <Grid item xs={4}>
                    <RestaurantBox name="Sazon" description="hello" />
                </Grid>
                <Grid item xs={4}>
                    <RestaurantBox name="Sazon" description="hello" />
                </Grid>
            </Grid>
        );
    }
}


export default RestaurantsGrid;