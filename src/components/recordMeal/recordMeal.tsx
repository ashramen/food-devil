import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Box, CircularProgress, Grid } from "@mui/material";

import LockPage from '../lockPage/lockPage';
import TopAppBar from '../topAppBar/topAppBar';
import RecordMealTable from './recordMealTable';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';
import './recordMeal.css';
import { getRestaurants } from "../../api/restaurants";
import RecordMealCart from "./recordMealCart";

export interface RestaurantData {
    _id: string;
    name: string;
    food: FoodData[];
}

export interface Nutrients {
    total_cal: number,
    fat_g: number,
    sat_fat_g: number,
    trans_fat_g: number,
    sodium_mg: number,
    carbs_g: number,
    fiber_g: number,
    sugars_g: number,
    protein_g: number,
    cholesterol_mg: number
}

interface FoodData extends Nutrients {
    _id: string;
    restaurantId: string,
    menu: string,
    submenu: string,
    name: string,
    allergens: string[]
    ingredients: string,
    serving_size: string,
    servings_per_container: number,
}

export interface IRawFoodData extends Nutrients {
    _id: string;
    restaurantId: string,
    menu: string,
    submenu: string,
    name: string,
    allergens: string | null,
    ingredients: string,
    serving_size: string,
    servings_per_container: number
}

export interface CartItems extends Omit<IRawFoodData, 'restaurantId'> {
    restaurant: string;
    count: number;
}


interface RecordMealProps extends PropsFromRedux, RouteComponentProps {

}

interface RecordMealStates {
    restaurants: RestaurantData[];
    loading: boolean;
    cartItems: CartItems[];
    cartNutrients: Nutrients;
}

class RecordMeal extends React.Component<RecordMealProps, RecordMealStates> {
    constructor(props: RecordMealProps) {
        super(props);
        this.state = {
            restaurants: [],
            loading: true,
            cartItems: [],
            cartNutrients: {
                total_cal: 0,
                fat_g: 0,
                sat_fat_g: 0,
                trans_fat_g: 0,
                sodium_mg: 0,
                carbs_g: 0,
                fiber_g: 0,
                sugars_g: 0,
                protein_g: 0,
                cholesterol_mg: 0
            }
        };
    }

    // call api
    async componentDidMount() {
        if (this.props.loggedIn) {
            const restaurants: RestaurantData[] = await getRestaurants(this.props.token) as RestaurantData[];
            restaurants.sort((restaurantA: RestaurantData, restaurantB: RestaurantData) => {
                return (restaurantA.name < restaurantB.name ? -1 : 1)
            });
            this.setState({ restaurants, loading: false });
        }
    }

    addItem(food: IRawFoodData) {
        const { restaurants, cartItems, cartNutrients } = this.state;
        for (const nutrient of Object.keys(cartNutrients)) {
            cartNutrients[nutrient as keyof Nutrients] += food[nutrient as keyof Nutrients];
        }
        for (const item of cartItems) {
            if (item._id === food._id) {
                item.count += 1;
                this.setState({ cartItems });
                return;
            }
        }
        cartItems.push({ ...food, restaurant: restaurants.filter(restaurant => restaurant._id === food.restaurantId)[0].name, count: 1 });
        this.setState({ cartItems, cartNutrients });
    }

    deleteItem(food: CartItems) {
        const { cartItems, cartNutrients } = this.state;
        for (const nutrient of Object.keys(cartNutrients)) {
            cartNutrients[nutrient as keyof Nutrients] -= food[nutrient as keyof Nutrients];
        }
        // @ts-ignore
        for (const [index, item] of cartItems.entries()) {
            if (item._id === food._id) {
                item.count -= 1;
                if (item.count === 0) {
                    cartItems.splice(index, 1);
                }
                this.setState({ ...this.state, cartItems: cartItems });
                return;
            }
        }
    }

    onClear() {
        this.setState({ cartItems: [] });
    }

    render() {
        return (
            <>
                <TopAppBar page='record meal' />
                {this.props.loggedIn ?
                    <>
                        <Box className="container">
                            <div className='title'>Record Meal</div>
                            {this.state.loading ?
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: "absolute",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <CircularProgress size={100} />
                                </Box> :
                                <Grid container spacing={2} mt={1}>
                                    <Grid item xs={10}>
                                        <RecordMealTable addItemEvent={(food) => this.addItem(food)} allRestaurants={this.state.restaurants} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <RecordMealCart cartItems={this.state.cartItems} onClear={() => this.onClear()} deleteItemEvent={food => this.deleteItem(food)} nutrients={this.state.cartNutrients}/>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </>
                    : <LockPage />}
            </>
        );
    }
}

const mapStateToProps = (state: State) => ({
    loggedIn: state.logIn.loggedIn,
    username: state.logIn.username,
    token: state.logIn.token,
});

const mapDispatchToProps = {
    logIn,
    logOut
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(withRouter(RecordMeal));