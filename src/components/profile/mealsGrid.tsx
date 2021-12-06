import React from 'react';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import MealCard from './mealCard';
import * as MC from './mealCardSplit';
import { getFormattedDate } from '../restaurants/restaurantConstants';

interface IMealsGridProps {
    meals: MC.IRawMealData[];
}

interface IMealByDate {
    [date: string]: MC.IRawMealData[];
}

interface IMealsGridState {
    mealsByDate: IMealByDate;
}

export default class MealsGrid extends React.Component<IMealsGridProps, IMealsGridState> {

    constructor(props: IMealsGridProps) {
        super(props);
        this.state = {
            mealsByDate: {},
        };
    }

    componentDidMount() {
        let mealsByDate = {} as IMealByDate;
        let prevDates = new Set();
        // meals are already sorted in descending chronological order
        for (const meal of this.props.meals) {
            const currDate = getFormattedDate(new Date(meal.updatedAt));
            if (prevDates.has(currDate)) {
                mealsByDate[""+currDate].push(meal);
            } else {
                prevDates.add(currDate);
                mealsByDate[""+currDate] = [meal];
            }
        }

        this.setState({
            mealsByDate: mealsByDate,
        });
    }

    americanDateToDate(date: string): Date {
        let arr = date.split("/").map(d => parseInt(d));
        return new Date(arr[2], arr[0]-1, arr[1]);
    }

    render() {
        const {
            mealsByDate,
        } = this.state;

        let keys = Object.keys(mealsByDate);
        let sortedKeys = 
            keys.map(date => this.americanDateToDate(date).getTime()).sort().map((date) => getFormattedDate(new Date(date))).reverse();

        return (
            <>
                {sortedKeys.map((date, index) => 
                        <>
                            <Grid container justifyContent="flex-end" direction="row">
                                <Grid item xs={12}>
                                    <div className='title'>{(new Date(date)).toLocaleDateString()}</div>
                                </Grid>
                            </Grid>
                            <Divider variant='middle' />
                            <Grid container spacing={2} pb={2} sx={{ marginTop: 1, width:'fit-content' }}>
                                {mealsByDate[date].map( (rawMealData) =>
                                    <Grid item xs={3}>
                                        <MealCard rawMealData={rawMealData} index={index} />
                                    </Grid>
                                )
                                }
                            </Grid>
                        </>
                )}
            </>
        );
    }
}