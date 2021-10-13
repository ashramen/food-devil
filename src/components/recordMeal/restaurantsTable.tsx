import React from 'react';
import { List, ListItemButton, ListItemText } from "@mui/material";
import './recordMeal.css';
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface RestaurantData {
    id: number;
    name: string;
}

interface RestaurantsTableState {
    openRestaurants: {
        [id: number]: boolean;
    }
}

const restaurants: RestaurantData[] = [
    {
        id: 1,
        name: 'Tandoor',
    }, {
        id: 2,
        name: 'Il Forno',
    }
];

class RestaurantsTable extends React.Component<{}, RestaurantsTableState> {

    selectRestaurant(id: number): void {
        let newState: RestaurantsTableState = {...this.state};
        newState.openRestaurants[id] = !newState.openRestaurants[id];
        this.setState(newState);
        console.log(this.state);
    }

    constructor(props: {}) {
        super(props);
        let state: RestaurantsTableState = {
            openRestaurants: {}
        }
        restaurants.forEach(restaurant => state.openRestaurants[restaurant.id] = false);
        this.state = state;
    }

    render() {
        return (
            <List>
                {restaurants.map(restaurant => (
                    <ListItemButton divider={true} onClick={() => this.selectRestaurant(restaurant.id)}>
                        <ListItemText primary={restaurant.name} />
                        {this.state.openRestaurants[restaurant.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                ))}
            </List>
        );
    }
}

export default RestaurantsTable;