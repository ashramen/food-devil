import React from 'react';

import Grid from '@mui/material/Grid';

import MealCard from './mealCard';
import * as MC from './mealCardSplit';

interface IMealsGrid {
    meals: MC.IRawMealData[];
}

export default class MealsGrid extends React.Component<IMealsGrid> {

    render() {
        const meals = this.props.meals;
        return (
            <Grid container spacing={2} pb={2}>
                {meals.map( (rawMealData, index) =>
                    <Grid item xs={3}>
                        <MealCard rawMealData={rawMealData} index={index} />
                    </Grid>
                )
                }
            </Grid>
        );
    }
}