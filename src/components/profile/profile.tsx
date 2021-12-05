import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from "react-router-dom";

import { State } from '../../store/index';
import TopAppBar from '../topAppBar/topAppBar';
import LockPage from '../lockPage/lockPage';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';

import { getComparator, stableSort, Order, getFormattedDate } from "../restaurants/restaurantConstants";
import { getMealByRestaurant } from '../../api/meals';

import MealCard from './mealCard';


interface Column {
    id: 'meal' | 'date';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'meal', label: 'Meal', minWidth: 250, maxWidth: 300 },
    { id: 'date', label: 'Date', minWidth: 10, maxWidth: 100 }
];

interface IFoodRawData {
    _id: string,
    name: string
}
interface IRawMealData {
    _id: string,
    user_id: string,
    foods: IFoodRawData[],
    restaurant_id: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

interface IMealData {
    meal: string;
    date: string;
    id: number;
}





function createData(
    meal: string,
    date: string,
    id: number,
): IMealData {
    return { meal, date, id };
}

const dataRows: IMealData[] = [
    createData("Egg and Cheese Burrito", "12/10/21", 1),
    createData(" Cheese Burrito", "12/10/21", 2),
    createData("Egg and Cheese Burrito", "12/10/21", 3),
    createData("Egg  Burrito", "12/10/21", 4),
    createData("Egg  Burrito", "12/10/21", 5),
    createData("Sandwich", "12/10/21", 6)
];

interface MealsOrderedProps extends PropsFromRedux {
}

interface MealsOrderedState {
    rows: IMealData[],
    order: Order,
    orderBy: keyof IMealData,
    page: number,
    searched: string,
    rowsPerPage: number,
    originalRows: IMealData[]
}


class ProfilePage extends React.Component<MealsOrderedProps, MealsOrderedState> {
    constructor(props: MealsOrderedProps) {
        super(props);
        this.state = {
            rows: dataRows,
            order: 'asc',
            orderBy: 'meal',
            page: 0,
            searched: '',
            rowsPerPage: 5,
            originalRows: dataRows,
        };
    }


    async componentDidMount() {
        if (!this.props.userId) {
            console.log("user not logged in");
            return;
        }
        const userIdUnboxed = this.props.userId;
        const mealData: IMealData[] = await this.getReviewData(userIdUnboxed, this.props.token);
        this.setState({
            rows: mealData,
            originalRows: mealData
        });
    }

    async getReviewData(user_id: string, token: string): Promise<IMealData[]> {
        const fetchData = await getMealByRestaurant(user_id, "616ad5d1d252dea11b9043db", token);
        if (fetchData.message === "Auth failed") {
            console.log("Unable to fetch reviews");
            return [];
        }

        const mealItems = fetchData as IRawMealData[];
        let id = 0;

        const formattedMeals: IMealData[] = [];

        for (const meal of mealItems) {
            const currentFoods: IFoodRawData[] = meal.foods;

            for (const food of currentFoods) {
                const currentEntry: IMealData = {
                    meal: food.name,
                    date: getFormattedDate(new Date(meal.createdAt)),
                    id: id
                }
                formattedMeals.push(currentEntry);
                id += 1
            }
        }

        return formattedMeals;
    }

    requestSearch(event: any) {
        const searchedVal = event.target.value;

        const filteredRows = this.state.originalRows.filter((row) => {
            return row.meal.toLowerCase().includes(searchedVal.toLowerCase());
        });

        this.setState({
            searched: searchedVal,
            rows: filteredRows,
        })
    };

    handleChangePage(event: any, newPage: number) {
        this.setState({
            page: newPage
        });
    };

    handleChangeRowsPerPage(event: any) {
        this.setState({
            rowsPerPage: +event.target.value,
            page: 0,
        });
    };

    handleRequestSort(
        event: React.MouseEvent<unknown>,
        property: keyof IMealData,
    ) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        })
    };

    createSortHandler(property: keyof IMealData) {
        return (event: React.MouseEvent<unknown>) => {
            this.handleRequestSort(event, property);
        };
    }

    render() {
        const {
            rows,
            order,
            orderBy,
            page,
            searched,
            rowsPerPage
        } = this.state;
        if (rows.length === 0) {
            return (<div>{"You haven't ordered any meals from here yet"}</div>);
        }
        return (
            <>
                <Box mx={2}>
                    <TopAppBar page='profile' />
                    {this.props.loggedIn ?
                    <>
                        <Grid container mt={15}>
                            <Grid item>
                                <div>Welcome {this.props.userId}</div>
                            </Grid>
                        </Grid>
                        <Grid item>
                                <MealCard name={"Sazon"} description={"desc hello"} id={"some id"} index={300} />
                        </Grid>
                    </> : <LockPage />}
                </Box>
            </>
                                   
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
export default connector(ProfilePage);