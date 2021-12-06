import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';


import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

import { RestaurantInfo } from '../restaurants/restaurantConstants';
import { getFood } from '../../api/foods';
import { getRestaurant } from '../../api/restaurants';

import * as MC from './mealCardSplit';

class MealCard extends React.Component<MC.MealCardProps, MC.MealCardState> {
    constructor(props: MC.MealCardProps) {
        super(props);
        this.state = {
            mealsPerRestaurant: {},
            mealTime: new Date(),
            raised: false,
            shadow: 1,
            fade: false,
        };
    }
    
    async componentDidMount() {
        setTimeout(() => this.setState({ fade: true }), 150 * this.props.index);
        const rawMealData = this.props.rawMealData;
        if (!this.props.loggedIn) {
            console.log("user not logged in");
            return;
        }
        
        const fetchData = await this.getMealData(this.props.rawMealData);

        this.setState({
            mealsPerRestaurant: fetchData,
            mealTime: new Date(rawMealData.updatedAt),
        });
    }

    async getMealData(rawMealData: MC.IRawMealData) {
        let mealsPerRestaurant = {} as MC.IMealData;
        for (const rest of rawMealData.restaurants) {
            const restName = await getRestaurant(rest, this.props.token);
            mealsPerRestaurant[""+restName.name] = {
                foods: [],
                mostCaloricFood: '',
                totalCalories: 0,
            }
        }
        let maxCal = -1;
        let maxCalFood = "something went wrong";
        for (const food of rawMealData.foods) {
            const foodData: MC.IRawFoodData = await getFood(food, this.props.token) as MC.IRawFoodData;
            const restKey = await getRestaurant(foodData.restaurantId, this.props.token);
            if (foodData.total_cal > maxCal) {
                maxCal = foodData.total_cal;
                maxCalFood = foodData.name;
            }
            mealsPerRestaurant[restKey.name].foods.push(foodData.name);
            mealsPerRestaurant[restKey.name].totalCalories += foodData.total_cal;
            mealsPerRestaurant[restKey.name].mostCaloricFood = maxCalFood;
        }
        console.log(mealsPerRestaurant);
        return mealsPerRestaurant;
    }

    render() {
        const {
            mealsPerRestaurant,
            mealTime,
            raised,
            shadow,
            fade
        } = this.state;

        return (
            <Fade in={fade} timeout={300}>
                <Card>
                    <CardActionArea onClick={() => console.log("do a popup")} disableRipple>
                        <Grid container direction='row'>
                            <Grid item>
                                <CardMedia component="img" height="140" image={MC.nameToImage["Sazon"]} alt={"Sazon"} />
                            </Grid>
                            <Grid item>
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography component="div" variant="h5">
                                        Sazon
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        Arepa Bowl
                                    </Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                    <Button onClick={() => console.log(this.state)}>Debug</Button>        
                </Card>
            </Fade>
            
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