import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';
import { postMeal } from '../../api/meals';

import { Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Zoom } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Nutrients, CartItems } from './recordMeal';


interface CartProps extends PropsFromRedux {
    cartItems: CartItems[];
    onClear: () => void;
    deleteItemEvent: (food: CartItems) => void;
    nutrients: Nutrients
}

interface CartStates {

}

class RecordMealCart extends React.Component<CartProps, CartStates> {
    constructor(props: CartProps) {
        super(props);
        this.state = {};
    }

    async recordMeal() {
        const {
            cartItems,
            onClear,
            userId,
            token
        } = this.props;
        const mealIdList: string[] = cartItems.map(item => item._id);
        await postMeal(userId!, mealIdList, token);
        onClear();
    }

    displayNutrition() {
        const { nutrients } = this.props;
        return (<span style={{ whiteSpace: 'pre-line' }}>
            {"Nutrition Stats:\n" +
                "Total Calories: " + nutrients.total_cal + " cal\n" +
                "Fat: " + nutrients.fat_g + " g\n" +
                "Saturated Fat: " + nutrients.sat_fat_g + " g\n" +
                "Trans Fat: " + nutrients.trans_fat_g + " g\n" +
                "Sodium: " + nutrients.sodium_mg + " mg\n" +
                "Carbohydrates: " + nutrients.carbs_g + " g\n" +
                "Fiber: " + nutrients.fiber_g + " g\n" +
                "Sugar: " + nutrients.sugars_g + " g\n" +
                "Protein: " + nutrients.protein_g + " g\n" +
                "Cholesterol: " + nutrients.cholesterol_mg + " mg"}
        </span>)
    }

    render() {
        const { nutrients } = this.props;
        return (
            <Box>
                <div className='meal-cart--title'>Meal Items</div>
                <List dense={true}>
                    {this.props.cartItems.map(item => {
                        return (
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete"
                                                onClick={() => this.props.deleteItemEvent(item)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    {`x${item.count}`}`
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.restaurant}
                                />
                            </ListItem>
                        )
                    })}
                </List>
                <Tooltip 
                    TransitionComponent={Zoom} 
                    title={this.displayNutrition()} 
                    arrow 
                    followCursor={true} 
                    placement="top-start">
                        {<Button sx={{color: '#003087'}}>View Meal Nutrition</Button>}
                </Tooltip>
                <Button variant='contained' onClick={() => this.recordMeal()} sx={{bgcolor: '#003087'}} disabled={this.props.cartItems.length === 0}>
                    Record Meal
                </Button>
            </Box>
        )
    }
}

const mapStateToProps = (state: State) => ({
    loggedIn: state.logIn.loggedIn,
    token: state.logIn.token,
    userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(RecordMealCart);
