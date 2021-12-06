import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';


import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';


import { getComparator, stableSort, Order, getFormattedDate } from "../restaurants/restaurantConstants";
import { getMealByRestaurant } from '../../api/meals';

export interface MealCardProps extends PropsFromRedux {
    rawMealData: IRawMealData;
    index: number;
};

export interface MealCardState {
    mealsPerRestaurant: IMealData;
    mealTime: Date;
    raised: boolean;
    shadow: number;
    fade: boolean;
}

export interface InameToImage {
    [x: string]: string;
}

export const nameToImage: InameToImage = {
    "Beyu Blue Coffee": "/images/beyu_blue.png",
    "Beyu Cafe at Duke Law": "/images/beyu_cafe_duke_law.png",
    "Bseisu Coffee Bar": "/images/bseisu.jpg",
    "Cafe": "/images/cafe.png",
    "Cafe 300": "/images/cafe_300.jpg",
    "Freeman Cafe": "/images/freeman.jpg",
    "Ginger + Soy": "/images/ginger.png",
    "Gyotaku": "/images/gyotaku.png",
    "Il Forno": "/images/il_forno.png",
    "J.B.'s Roast & Chops": "/images/jbs.png",
    "Marketplace": "/images/marketplace.jpg",
    "McDonald's": "/images/mcdonalds.png",
    "Panda Express": "/images/panda.jpeg",
    "Panera Bread Company": "/images/panera.jpg",
    "Red Mango": "/images/red_mango.png",
    "Saladalia @ The Perk": "/images/saladelia.jpg",
    "Sanford Deli": "/images/sanford.jpg",
    "Sazon": "/images/sazon.png",
    "Sprout": "/images/sprout.png",
    "Tandoor Indian Cuisine": "/images/tandoor.png",
    "The Devils Krafthouse": "/images/krafthouse.png",
    "The Farmstead": "/images/farmstead.png",
    "The Loop Pizza Grill": "/images/loop.png",
    "The Pitchfork": "/images/pitchfork.png",
    "The Skillet": "/images/skillet.png",
    "Trinity Cafe": "/images/trinity.png",
    "Twinnie's": "/images/twinnie.png",
}

export interface IRawMealData {
    _id: string,
    user_id: string,
    foods: string[],
    restaurants: string[],
    createdAt: string,
    updatedAt: string,
    __v: number
}

export interface IMealData {
    [index: string]: {
        foods: string[],
        mostCaloricFood: string,
        totalCalories: number,
    },
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

export interface IRawFoodData extends Nutrients {
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

//////////////////////////////////////////////////

const mapStateToProps = (state: State) => ({
    loggedIn: state.logIn.loggedIn,
    token: state.logIn.token,
    userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
