import React from 'react';
import { Link } from "react-router-dom";


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import RestaurantsReviewPopup from './restaurantReviewPopup';

interface RestaurantBoxProps {
    name: string;
    description: string;
    id: number;
};

interface RestaurantBoxState {
    dialogOpen: boolean;
}

class RestaurantBox extends React.Component<RestaurantBoxProps, RestaurantBoxState> {

    constructor(props: RestaurantBoxProps) {
        super(props);
        this.state = {
            dialogOpen: false
        };
        this.onWriteAReviewClick = this.onWriteAReviewClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }


    onWriteAReviewClick() {
        this.setState({ dialogOpen: true });
        console.log(this.props.name);
    }

    handleClose() {
        this.setState({ dialogOpen: false })
    }



    render() {
        const {
            name,
            description
        } = this.props;

        const {
            dialogOpen
        } = this.state;

        return (
            <>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <Box sx={{ my: 3, mx: 2 }}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h4" component="div">
                                    {name}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography color="text.secondary" variant="body2">
                            {description}

                        </Typography>
                    </Box>
                    <Divider variant="middle" />

                    <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Link to={"/restaurants/" + name}> <Button >Learn More</Button> </Link>
                            </Grid>
                            <Grid item xs>
                                <Button onClick={() => this.onWriteAReviewClick()}>Write a Review</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <RestaurantsReviewPopup name={name} handleClose={this.handleClose} open={dialogOpen} />
            </>
        );
    }
}


export default RestaurantBox;