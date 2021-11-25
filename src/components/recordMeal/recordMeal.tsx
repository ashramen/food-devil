import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Box, CircularProgress, Collapse, Grid, List, ListItemButton, ListItemText } from "@mui/material";

import LockPage from '../lockPage/lockPage';
import TopAppBar from '../topAppBar/topAppBar';
import RecordMealTable from './recordMealTable';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';
import './recordMeal.css';
import { getRestaurants } from "../../api/restaurants";
import { getFoodsByRestaurant } from "../../api/foods";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import RecordMealCart from "./recordMealCart";

interface RestaurantData {
    _id: string;
    name: string;
    food: FoodData[];
}

interface FoodData {
    _id: string;
    restaurantId: string,
    menu: string,
    submenu: string,
    name: string,
    allergens: string[]
    ingredients: string,
    serving_size: string,
    servings_per_container: number,
    total_cal: number,
    fat_g: number,
    sat_fat_g: number,
    trans_fat_g: number,
    sodium_mg: number,
    carbs_g: number,
    fiber_g: number,
    sugars_g: number,
    protein_g: number
    cholesterol_mg: number
}

interface RecordMealProps extends PropsFromRedux, RouteComponentProps {

}

interface RecordMealStates {
    restaurants: RestaurantData[];
    foods: {
        [id: string]: FoodData[]
    };
    displayedRestaurants: {
        [id: string]: boolean;
    };
    expandedRestaurants: {
        [id: string]: boolean;
    };
    loading: boolean;
    cartItems: { _id: string, name: string, restaurant: string, count: number }[]
}

class RecordMeal extends React.Component<RecordMealProps, RecordMealStates> {
    constructor(props: RecordMealProps) {
        super(props);
        this.state = {
            restaurants: [],
            displayedRestaurants: {},
            expandedRestaurants: {},
            foods: {},
            loading: true,
            cartItems: [],
        };
    }

    // call api
    async componentDidMount() {
        if (this.props.loggedIn) {
            let state: RecordMealStates = {
                restaurants: [],
                displayedRestaurants: {},
                expandedRestaurants: {},
                foods: {},
                loading: false,
                cartItems: [],
            }
            const restaurants: RestaurantData[] = await getRestaurants(this.props.token) as RestaurantData[];
            restaurants.sort((restaurantA: RestaurantData, restaurantB: RestaurantData) => {
                return (restaurantA.name < restaurantB.name ? -1 : 1)
            });
            const foods: { [id: string]: FoodData[] } = {};
            for (const restaurant of restaurants) {
                foods[restaurant._id] = await getFoodsByRestaurant(restaurant._id, this.props.token) as FoodData[];
            }
            state.restaurants = restaurants;
            state.foods = foods;
            restaurants.forEach(restaurant => state.displayedRestaurants[restaurant._id] = true);
            restaurants.forEach(restaurant => state.expandedRestaurants[restaurant._id] = false);
            this.setState(state);
        }
    }

    selectRestaurant(id: string): void {
        let newState: RecordMealStates = { ...this.state };
        newState.expandedRestaurants[id] = !newState.expandedRestaurants[id];
        this.setState(newState);
    }

    restaurantDropdown(restaurant: RestaurantData) {
        return (<>
            <ListItemButton divider={true}
                            onClick={() => this.selectRestaurant(restaurant._id)}>
                <ListItemText primary={restaurant.name}/>
                {this.state.expandedRestaurants[restaurant._id] ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={this.state.expandedRestaurants[restaurant._id]}>
                <RecordMealTable id={restaurant._id} addItemEvent={(id, name, restaurantId) => this.addItem(id, name, restaurantId)}/>
            </Collapse>
        </>)
    }

    addItem(id: string, name: string, restaurantId: string) {
        const cartItems = this.state.cartItems.slice();
        for (const item of cartItems) {
            if (item._id === id) {
                item.count += 1;
                this.setState({ ...this.state, cartItems: cartItems });
                return;
            }
        }
        cartItems.push({ _id: id, name: name, restaurant: this.state.restaurants.filter(restaurant => restaurant._id === restaurantId)[0].name, count: 1 });
        this.setState({ ...this.state, cartItems: cartItems });
    }

    deleteItem(foodId: string) {
        const cartItems = this.state.cartItems.slice();
        // @ts-ignore
        for (const [index, item] of cartItems.entries()) {
            if (item._id === foodId) {
                item.count -= 1;
                if (item.count === 0) {
                    cartItems.splice(index, 1);
                }
                this.setState({ ...this.state, cartItems: cartItems });
                return;
            }
        }
    }

    render() {
        return (
            <>
                <TopAppBar page='record meal'/>
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
                                    <CircularProgress size={100}/>
                                </Box> :
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <List>
                                            {this.state.restaurants.map(
                                                restaurant =>
                                                    this.state.displayedRestaurants[restaurant._id]
                                                        ? this.restaurantDropdown(restaurant)
                                                        : <div/>)}
                                        </List>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <RecordMealCart cartItems={this.state.cartItems} deleteItemEvent={foodId => this.deleteItem(foodId)}/>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                    </>
                    : <LockPage/>}
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