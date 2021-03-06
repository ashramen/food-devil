import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';
import { postMeal } from '../../api/meals';

import { Box, Button, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Zoom } from "@mui/material";
import { TransitionGroup } from 'react-transition-group';

import DeleteIcon from '@mui/icons-material/Delete';
import { Nutrients, CartItems } from './recordMeal';
import RecordMealSuccessPopup from "./recordMealSuccessPopup";


interface CartProps extends PropsFromRedux {
    cartItems: CartItems[];
    onClear: () => void;
    deleteItemEvent: (food: CartItems) => void;
    nutrients: Nutrients
}

interface CartStates {
    recordSuccessDialogOpen: boolean;
}

class RecordMealCart extends React.Component<CartProps, CartStates> {
    constructor(props: CartProps) {
        super(props);
        this.state = {
            recordSuccessDialogOpen: false,
        };
    }

    async recordMeal() {
        const {
            cartItems,
            onClear,
            userId,
            loggedIn,
            token
        } = this.props;
        if (loggedIn) {
            const mealIdList: string[] = cartItems.map(item => item._id);
            const postedMeal = await postMeal(userId!, mealIdList, token);
            if (postedMeal.message === "Auth failed") {
                console.log(postedMeal);
            } else {
                console.log("do a popup");
                console.log(this.state);
            }
            onClear();
        }
    }

    displayNutrition() {
        const { nutrients } = this.props;
        return (<span style={{ whiteSpace: 'pre-line' }}>
            {"Total Calories: " + nutrients.total_cal + " cal\n" +
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
        return (
            <Box>
                <div className='meal-cart--title'>Meal Items</div>
                {this.props.loggedIn? <div></div> : <div className='meal-cart--subtitle'>Please log in to record meals.</div>}
                {this.props.cartItems.length > 0? <List dense={true}>
                    <TransitionGroup>
                        {this.props.cartItems.map(item => {
                            return (
                                <Collapse key={item._id}>
                                {<ListItem
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
                                </ListItem>}
                                </Collapse>
                            )
                        })}
                    </TransitionGroup>
                </List> : this.props.loggedIn? <div className='meal-cart--subtitle'>You don't have anything yet. Add foods to your meal!</div> : <div></div>}
                {this.props.cartItems.length > 0? <>
                    <div>
                        <Tooltip
                            TransitionComponent={Zoom}
                            title={this.displayNutrition()}
                            arrow
                            placement="left-start">
                                {<Button sx={{color: '#003087', marginBottom: 1}}>View Meal Nutrition</Button>}
                        </Tooltip>
                    </div>
                    <Button variant='contained' onClick={() => this.recordMeal()} sx={{bgcolor: '#003087'}} disabled={this.props.cartItems.length === 0 || !this.props.loggedIn}>
                        Record Meal
                    </Button>
                </> : <div></div>}
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
