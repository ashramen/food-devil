import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';
import { postMeal } from '../../api/meals';

import { Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface CartProps extends PropsFromRedux {
    cartItems: { _id: string, name: string, restaurant: string, count: number }[];
    onClear: () => void;
    deleteItemEvent: (foodId: string) => void;
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

    render() {
        return (
            <Box>
                <div className='meal-cart--title'>Meal Items</div>
                <List dense={true}>
                    {this.props.cartItems.map(item => {
                        return (
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete"
                                                onClick={() => this.props.deleteItemEvent(item._id)}>
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
                <Button variant='contained' onClick={() => this.recordMeal()} disabled={this.props.cartItems.length === 0}>
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
