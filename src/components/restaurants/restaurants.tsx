import React from 'react';

import TopAppBar from '../topAppBar/topAppBar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

let restaurant_list = ["Tandoor", "Il Forno"]

interface RestaurantBios {
  [x: string]: string;
}

const restaurantBios: RestaurantBios = {
  'Tandoor': "Tandoor is a good restaurant",
  'Sazon': "Sazon is a good restaurant",
  'Farmstead': "Your favorite classic dishes just got a fresh, sustainable and healthier upgrade. Head to The Farmstead for a meal that satisfies your tastes and your conscience. Following the Farm to Fork philosophy, this venue specializes in cooking up great meals using the finest ingredients—sourced from local suppliers whenever possible.",
}

class Restaurants extends React.Component{

  render() {
    return (
        <Box mx={2}>
          <>
            <TopAppBar page='restaurants'/>
            <Grid container mt={15}>
              <Grid item xs={6}>
                <div className='title'>Restaurants</div>
              </Grid>
            </Grid>

            

            <Grid container>
              <Grid item xs={6}>
                <div className='title'>WU</div>
              </Grid>

              <Grid container spacing={3}>
             
              
            </Grid>


             
              
            </Grid>
            
            <Grid container justifyContent='left'>
              {Object.keys(restaurantBios).map((key: string) => {
                const description = restaurantBios[key];
                return (<Box
                  sx={{
                    width: 300,
                    height: 300,
                
                    backgroundColor: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }} 
                >
                  <Grid>

                  {key}
                  </Grid>
                  {description}
                  <Grid item xs={12} mt={1}>
                    <Button variant='contained' sx={{
                      backgroundColor: '#003087'
                    }}>{'See Reviews'}</Button>
                  </Grid>
                </Box>)
              })}
            </Grid>
        

            
          </>
        </Box>
    );
  }
}

export default Restaurants;