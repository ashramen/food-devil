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

import MealCardPopup from './mealCardPopup';
import * as MC from './mealCardSplit';

class MealCard extends React.Component<MC.MealCardProps, MC.MealCardState> {
    constructor(props: MC.MealCardProps) {
        super(props);
        this.state = {
            mealsPerRestaurant: {},
            mostSignificantRestaurant: "",
            mealTime: new Date(),
            dialogOpen: false,
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
        let maxFoodCal = -1, maxRestCal = -1;
        let maxFood  = "something went wrong", maxRest = "something went wrong";
        for (const food of rawMealData.foods) {
            const foodData: MC.IRawFoodData = await getFood(food, this.props.token) as MC.IRawFoodData;
            const restKey = await getRestaurant(foodData.restaurantId, this.props.token);
            if (foodData.total_cal > maxFoodCal) {
                maxFoodCal = foodData.total_cal;
                maxFood = foodData.name;
            }
            mealsPerRestaurant[restKey.name].foods.push(foodData.name);
            mealsPerRestaurant[restKey.name].totalCalories += foodData.total_cal;
            mealsPerRestaurant[restKey.name].mostCaloricFood = maxFood;

            if (mealsPerRestaurant[restKey.name].totalCalories > maxRestCal) {
                maxRestCal = mealsPerRestaurant[restKey.name].totalCalories;
                maxRest = restKey.name;
            }
        }

        this.setState({ mostSignificantRestaurant: maxRest });
        return mealsPerRestaurant;
    }

    getTotalFoodsInMeal(): number {
        let ret = 0;
        const mpr = this.state.mealsPerRestaurant;
        for (const key in mpr) {
            for (const food of mpr[key].foods) {
                ret += 1;
            }
        }
        return ret;
    }

    debug() {
        let date = "8/14/2020";
        let dateObj = new Date(date);
        console.log(dateObj.toLocaleDateString());
    }

    render() {
        const {
            mealsPerRestaurant,
            mostSignificantRestaurant,
            mealTime,
            dialogOpen,
            raised,
            shadow,
            fade
        } = this.state;

        let loading = Object.keys(mealsPerRestaurant).length === 0;

        return (
            <>
                <Fade in={fade} timeout={300}>
                    <Card>
                        <CardActionArea onClick={() => this.setState({ dialogOpen: !dialogOpen })} disableRipple>
                            <Grid container direction='row' justifyContent="center">
                                <Grid item>
                                    <CardMedia component="img" height="140" image={MC.nameToImage[mostSignificantRestaurant]} alt={"restaurantImage"} />
                                </Grid>
                                <Grid item>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography component="div" variant="h5" display="inline">
                                            {mostSignificantRestaurant}
                                        </Typography>
                                        {loading ? ""
                                        : <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {mealsPerRestaurant[mostSignificantRestaurant].mostCaloricFood + 
                                            (this.getTotalFoodsInMeal() > 1 ? "\n+ " + (this.getTotalFoodsInMeal()-1) + " more" : "")
                                            }
                                        </Typography>}
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {loading ? "" : mealTime.toLocaleTimeString()}
                                        </Typography>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </CardActionArea>
                        <Button onClick={() => this.debug()}>Debug</Button>        
                    </Card>
                </Fade>
                <MealCardPopup mealsPerRestaurant={mealsPerRestaurant} handleClose={() => this.setState({dialogOpen: false})} open={dialogOpen}/>
            </>
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