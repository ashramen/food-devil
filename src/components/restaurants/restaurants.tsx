import React from 'react';

import TopAppBar from '../topAppBar/topAppBar';
import RestaurantsGrid from './restaurantsGrid';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Divider } from "@mui/material";

class Restaurants extends React.Component {

  render() {
    return (
      <Box mx={2}>
        <>
          <TopAppBar page='restaurants' />
          <Grid container mt={15}>
            <Grid item xs={6}>
              <div className='title'>Browse Restaurants</div>
            </Grid>
          </Grid>
          <Divider sx={{ marginBottom: 2 }} />
          <RestaurantsGrid />
        </>
      </Box>
    );
  }
}


export default Restaurants;