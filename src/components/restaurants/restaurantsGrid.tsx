import React from 'react';

import RestaurantBox from './restaurantBox';
import Grid from '@mui/material/Grid';
import { IRestaurantInfo, RestaurantInfo} from './restaurantConstants';

class RestaurantsGrid extends React.Component {

    render() {
        return (
            <Grid container spacing={2}>
                {RestaurantInfo.map(info => 
                    <Grid item xs={4}>
                        <RestaurantBox name={info.name} description="hello" id={info.id} />
                    </Grid>
                    )
                }
            </Grid>
        );
    }
}

export default RestaurantsGrid;
