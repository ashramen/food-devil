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

import * as MC from './mealCardSplit';

class MealCard extends React.Component<MC.MealCardProps, MC.MealCardState> {
    constructor(props: MC.MealCardProps) {
        super(props);
        this.state = {
            foods: [],
            timestamp: new Date(),
            raised: false,
            shadow: 1,
            fade: false,
        };
    }

    async getMealData(user_id: string, token: string): Promise<MC.IMealData[]> {
        const fetchData = await getMealByRestaurant(user_id, this.props.id, token);
        if (fetchData.message === "Auth failed") {
            console.log("Unable to fetch reviews");
            return [];
        }

        const mealItems = fetchData as MC.IRawMealData[];
        let id = 0;

        const formattedMeals: MC.IMealData[] = [];

        for (const meal of mealItems) {
            const currentFoods: MC.IFoodRawData[] = meal.foods;

            for (const food of currentFoods) {
                const currentEntry: MC.IMealData = {
                    meal: food.name,
                    date: getFormattedDate(new Date(meal.createdAt)),
                    id: id
                }
                formattedMeals.push(currentEntry);
                id += 1
            }
        }

        return formattedMeals;
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
                        <CardMedia component="img" height="140" image={MC.nameToImage[name]} alt={name} />
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