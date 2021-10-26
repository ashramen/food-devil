import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Box, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";

import LockPage from '../lockPage/lockPage';
import TopAppBar from '../topAppBar/topAppBar';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';
import './recordMeal.css';
import { getRestaurants } from "../../api/restaurants";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface allFoods {
    _id: string;
    restaurantId: string;
    menu: string;
    submenu: string;
    name: string;
    allergens: string[];
    ingredients: string | null;
    serving_size: string;
    servings_per_container: string;
    total_cal: number;
    fat_g: number;
    sat_fat_g: number;
    trans_fat_g: number;
    chloestrol_mg: number;
    sodium_mg: number;
    carbs_g: number;
    fiber_g: number;
    sugars_g: number;
    protein_g: number;
}

interface RestaurantData {
    _id: string;
    name: string;
}

interface RecordMealProps extends PropsFromRedux, RouteComponentProps {

}

interface RecordMealStates {
    restaurants: RestaurantData[];
    expandedRestaurants: {
        [id: string]: boolean;
    };
    loading: boolean;
}

class RecordMeal extends React.Component<RecordMealProps, RecordMealStates> {
    constructor(props: RecordMealProps) {
        super(props);
        this.state = {
            restaurants: [],
            expandedRestaurants: {},
            loading: true,
        };
    }

    // call api
    async componentDidMount() {
        if (this.props.loggedIn) {
            let state: RecordMealStates = {
                restaurants: [],
                expandedRestaurants: {},
                loading: false,
            }
            const restaurants: RestaurantData[] = await getRestaurants(this.props.token) as RestaurantData[];
            restaurants.sort((restaurantA: RestaurantData, restaurantB: RestaurantData) => {
                return (restaurantA.name < restaurantB.name? -1 : 1)
            });
            state.restaurants = restaurants;
            restaurants.forEach(restaurant => state.expandedRestaurants[restaurant._id] = false);
            this.setState(state);
        }
    }

    selectRestaurant(id: string): void {
        let newState: RecordMealStates = { ...this.state };
        newState.expandedRestaurants[id] = !newState.expandedRestaurants[id];
        this.setState(newState);
    }

    render() {
        return (
            <>
            <TopAppBar page='record meal'/>
            {this.props.loggedIn?
            <>
                <Box className="container">
                    <div className='title'>Record Meal</div>
                    {this.state.loading?
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
                    </Box> : <div></div>}
                    <List>
                        {this.state.restaurants.map(restaurant => (
                            <ListItemButton divider={true}
                                            onClick={() => this.selectRestaurant(restaurant._id)}>
                                <ListItemText primary={restaurant.name}/>
                                {this.state.expandedRestaurants[restaurant._id] ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                        ))}
                    </List>
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