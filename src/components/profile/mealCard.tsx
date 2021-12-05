import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';


import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';


import { getComparator, stableSort, Order, getFormattedDate } from "../restaurants/restaurantConstants";
import { getMealByRestaurant } from '../../api/meals';

interface MealCardProps extends PropsFromRedux {
    name: string;
    description: string;
    id: string;
    index: number;
};

interface MealCardState {
    foods: string[];
    timestamp: Date;

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

class MealCard extends React.Component<MealCardProps, MealCardState> {
    constructor(props: MealCardProps) {
        super(props);
        this.state = {
            foods: [],
            timestamp: new Date(),
            raised: false,
            shadow: 1,
            fade: false,
        };
    }

    
    render() {
        const {
            name,
            description,
            id,
            index,
        } = this.props;

        const {
            foods,
            timestamp,
            raised,
            shadow,
            fade
        } = this.state;

        return (
            <Card sx={{ maxWidth: 360 }}>
                <Grid container direction='row'>
                    <Grid item>
                        <CardMedia
                            component="img"
                            height="140"
                            image={nameToImage[name]}
                            alt={name} 
                        />
                    </Grid>
                    <Grid item>
                        <div>hello</div>
                    </Grid>
                    
                </Grid>
                
            </Card>
        );
    }
}

const mapStateToProps = (state: State) => ({
    loggedIn: state.logIn.loggedIn,
    token: state.logIn.token,
    userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(MealCard);