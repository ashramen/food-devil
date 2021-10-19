import React from 'react';

import Sidebar from '../sidebar/sidebar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

class Restaurants extends React.Component{

  render() {
    return (
        <Box mx={2}>
          <>
            <Sidebar page='restaurants'/>
            <Grid container mt={15}>
              <Grid item xs={6}>
                <div className='title'>Restaurants</div>
              </Grid>
            </Grid>
          </>
        </Box>
    );
  }
}

export default Restaurants;