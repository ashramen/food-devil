import React from 'react';

import RestaurantBox from './restaurantBox';

import Grid from '@mui/material/Grid';
import { RestaurantInfo } from './restaurantConstants';

class RestaurantsGrid extends React.Component {

    render() {
        return (
            <Grid container spacing={2} pb={2}>
                {RestaurantInfo.map(info =>
                    <Grid item xs={3}>
                        <RestaurantBox name={info.name} description={info.location} id={info.id} />
                    </Grid>
                )
                }
            </Grid>
        );
    }
}

export default RestaurantsGrid;
