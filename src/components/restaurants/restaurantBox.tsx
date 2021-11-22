import React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RestaurantsReviewPopup from './restaurantReviewPopup';

interface RestaurantBoxProps extends RouteComponentProps {
    name: string;
    description: string;
    id: number;
};

interface RestaurantBoxState {
    dialogOpen: boolean;
}

interface nameToImage {
    [x: string]: string;
}

const nameToImage: nameToImage = {
    "Beyu Blue Coffee": "/images/beyu_blue.png",
    "Beyu Cafe at Duke Law": "/images/beyu_cafe_duke_law.png",
    "Bseisu Coffee Bar": "/images/bseisu.jpg",
    "Cafe": "/images/cafe.png",
    "Cafe 300": "/images/cafe_300.jpg",
    "Freeman Cafe": "/images/freeman.jpg",
    "Ginger + Soy": "/images/ginger.png",
    "Gyotaku": "/images/gyotaku.png",
    "Il Forno": "/images/il_forno.png",
    "J.B.'s Roast & Chops": "/images/jbs.png",
    "Marketplace": "/images/marketplace.jpg",
    "McDonald's": "/images/mcdonalds.png",
    "Panda Express": "/images/panda.jpeg",
    "Panera Bread Company": "/images/panera.jpg",
    "Red Mango": "/images/red_mango.png",
    "Saladalia @ The Perk": "/images/saladelia.jpg",
    "Sanford Deli": "/images/sanford.jpg",
    "Sazon": "/images/sazon.png",
    "Sprout": "/images/sprout.png",
    "Tandoor Indian Cuisine": "/images/tandoor.png",
    "The Devils Krafthouse": "/images/krafthouse.png",
    "The Farmstead": "/images/farmstead.png",
    "The Loop Pizza Grill": "/images/loop.png",
    "The Pitchfork": "/images/pitchfork.png",
    "The Skillet": "/images/skillet.png",
    "Trinity Cafe": "/images/trinity.png",
    "Twinnie's": "/images/twinnie.png",
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
            description,
            id
        } = this.props;

        const {
            dialogOpen
        } = this.state;

        return (
            <>
                <Card sx={{ maxWidth: 360 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={nameToImage[name]}
                        alt={name}
                    />
                    <CardContent>
                        <Typography gutterBottom fontFamily="Open Sans" variant="h5" component="div">
                        {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {description}
                        </Typography>
                    </CardContent>
                    <Grid container alignItems='center' justifyContent='center'>
                        <Grid item>
                            <CardActions>
                                <Button onClick={() => {this.props.history.push("/restaurants/" + name + "/" + id.toString())}}>Learn More</Button>
                                <Button onClick={() => this.onWriteAReviewClick()}>Write a Review</Button>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
                <RestaurantsReviewPopup name={name} handleClose={this.handleClose} open={dialogOpen} id={id} />
            </>
        );
    }
}


export default withRouter(RestaurantBox);
