import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { connect, ConnectedProps } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { State } from '../../store/index';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';

import * as MC from './mealCardSplit';

interface RestaurantsReviewPopupProps extends PropsFromRedux {
    mealsPerRestaurant: MC.IMealData;
    handleClose: any;
    open: boolean;
}

class MealCardPopup extends React.Component<RestaurantsReviewPopupProps> {

    displayFoodNutrition(food: MC.IRawFoodData) {
        return (<span style={{ whiteSpace: 'pre-line' }}>
            {"Total Calories: " + food.total_cal + " cal\n" +
                "Fat: " + food.fat_g + " g\n" +
                "Saturated Fat: " + food.sat_fat_g + " g\n" +
                "Trans Fat: " + food.trans_fat_g + " g\n" +
                "Sodium: " + food.sodium_mg + " mg\n" +
                "Carbohydrates: " + food.carbs_g + " g\n" +
                "Fiber: " + food.fiber_g + " g\n" +
                "Sugar: " + food.sugars_g + " g\n" +
                "Protein: " + food.protein_g + " g\n" +
                "Cholesterol: " + food.cholesterol_mg + " mg"}
        </span>)
    }

    displayMealNutrition() {
        let totalNutrients = {
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
        } as MC.Nutrients;
        for (const rest in this.props.mealsPerRestaurant) {
            for (const food of this.props.mealsPerRestaurant[rest].foods) {
                totalNutrients.total_cal += food.total_cal;
                totalNutrients.fat_g += food.fat_g;
                totalNutrients.sat_fat_g += food.sat_fat_g;
                totalNutrients.trans_fat_g += food.trans_fat_g;
                totalNutrients.sodium_mg += food.sodium_mg;
                totalNutrients.carbs_g += food.carbs_g;
                totalNutrients.fiber_g += food.fiber_g;
                totalNutrients.sugars_g += food.sugars_g;
                totalNutrients.protein_g += food.protein_g;
                totalNutrients.cholesterol_mg += food.cholesterol_mg;
            }
        }
        return (<span style={{ whiteSpace: 'pre-line' }}>
            {"Total Calories: " + totalNutrients.total_cal + " cal\n" +
                "Fat: " + totalNutrients.fat_g + " g\n" +
                "Saturated Fat: " + totalNutrients.sat_fat_g + " g\n" +
                "Trans Fat: " + totalNutrients.trans_fat_g + " g\n" +
                "Sodium: " + totalNutrients.sodium_mg + " mg\n" +
                "Carbohydrates: " + totalNutrients.carbs_g + " g\n" +
                "Fiber: " + totalNutrients.fiber_g + " g\n" +
                "Sugar: " + totalNutrients.sugars_g + " g\n" +
                "Protein: " + totalNutrients.protein_g + " g\n" +
                "Cholesterol: " + totalNutrients.cholesterol_mg + " mg"}
        </span>)
    }

    render() {

        const { mealsPerRestaurant, handleClose, open } = this.props;

        return (
            <Dialog onClose={handleClose} open={open}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    {Object.keys(mealsPerRestaurant).map((rest) => 
                        <Grid item>
                            <Grid container
                                direction="row"
                                sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: 'fit-content',
                                bgcolor: 'background.paper',
                                '& svg': {
                                    m: 1.5,
                                },
                                '& hr': {
                                    mx: 0.5,
                                },
                                }}
                                justifyContent="center"
                            >
                                <Grid item xs={4} justifyContent="flex-end">
                                    <Typography component="div" variant="h5" display="inline">
                                        {rest}
                                    </Typography>
                                </Grid>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <Grid item xs={4} justifyContent="flex-start">
                                    <List>
                                        {mealsPerRestaurant[rest].foods.map((food) =>
                                            <Tooltip
                                              TransitionComponent={Zoom} 
                                              title={this.displayFoodNutrition(food as MC.IRawFoodData)} 
                                              arrow 
                                              followCursor={false} 
                                              placement="right">
                                                <ListItemButton>
                                                    <div>{food.name}</div>
                                                </ListItemButton>
                                            </Tooltip>
                                        )}
                                    </List>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                    )}
                    <Grid item>
                        <Tooltip
                          TransitionComponent={Zoom} 
                          title={this.displayMealNutrition()} 
                          arrow 
                          followCursor={false} 
                          placement="bottom">
                            <Button sx={{color: '#003087', marginBottom: 1}}>View Meal Nutrition</Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                
            </Dialog >
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
export default connector(MealCardPopup);
