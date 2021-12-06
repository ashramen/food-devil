import React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RestaurantsReviewPopup from './restaurantReviewPopup';
import { CardActionArea } from '@mui/material';

interface RestaurantBoxProps extends RouteComponentProps {
    name: string;
    description: string;
    id: string;
    index: number;
};

interface RestaurantBoxState {
    reviewDialogOpen: boolean;
    raised: boolean;
    shadow: number;
    fade: boolean;
}

interface InameToImage {
    [x: string]: string;
}

export const nameToImage: InameToImage = {
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
            reviewDialogOpen: false,
            raised: false,
            shadow: 1,
            fade: false,
        };
        this.onWriteAReviewClick = this.onWriteAReviewClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this.setState({ fade: true }), 150 * this.props.index);
    }

    onWriteAReviewClick() {
        this.setState({ reviewDialogOpen: true });
    }

    handleClose() {
        this.setState({ reviewDialogOpen: false })
    }

    render() {
        const {
            name,
            description,
            id,
        } = this.props;

        const {
            reviewDialogOpen,
            raised,
            shadow,
            fade
        } = this.state;

        return (
            <>
                <Fade in={fade} timeout={300}>
                    <Card sx={{ maxWidth: 360 }}
                    onMouseOver={()=>this.setState({ raised: true, shadow:20})}
                    onMouseOut={()=>this.setState({ raised: false, shadow:1})}
                    raised={raised}
                    elevation={shadow}
                    >
                        <CardActionArea onClick={() => { this.props.history.push("/restaurants/" + name + "/" + id.toString()) }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={nameToImage[name]}
                                alt={name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" onClick={() => { this.props.history.push("/restaurants/" + name + "/" + id.toString()) }}>
                                    {name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>                    
                    </Card>
                </Fade>
                <RestaurantsReviewPopup name={name} handleClose={this.handleClose} open={reviewDialogOpen} id={id} />
            </>
        );
    }
}


export default withRouter(RestaurantBox);
