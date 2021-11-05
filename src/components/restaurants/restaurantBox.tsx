import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import RestaurantsReviewPopup from './restaurantReviewPopup';

interface RestaurantBoxProps {
    name: string;
    description: string;
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

        this.onLearnMoreClick = this.onLearnMoreClick.bind(this);
        this.onWriteAReviewClick = this.onWriteAReviewClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }


    onLearnMoreClick() {
        console.log("Clicked");
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
                                <Button onClick={() => this.onLearnMoreClick()}>Learn More</Button>
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