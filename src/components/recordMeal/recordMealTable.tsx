import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

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
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

import { getFoodsByRestaurant } from "../../api/foods";
import { getComparator, stableSort, Order } from "./recordMealConstants";

interface Column {
    id: 'foodName' | 'allergens' | 'record';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
    sortDisabled?: boolean;
}

const columns: readonly Column[] = [
    { id: 'foodName', label: 'Food', minWidth: 10, maxWidth: 100 },
    { id: 'allergens', label: 'Allergens', minWidth: 250, maxWidth: 300 },
    {
        id: 'record',
        label: '',
        minWidth: 100,
        maxWidth: 100,
        align: 'right',
        sortDisabled: true,
    }
];

interface IRawFoodData {
    _id: string;
    restaurantId: string,
    menu: string,
    submenu: string,
    name: string,
    allergens: string | null,
    ingredients: string,
    serving_size: string,
    servings_per_container: number,
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

interface IFormattedFoodData {
    foodName: string;
    allergens: string;
    record: any;
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

interface FoodTableProps extends PropsFromRedux{
    id: string;
    addItemEvent: (id: string, name: string, restaurantId: string) => void;
}

interface FoodTableStates {
    rows: IFormattedFoodData[],
    filteredRows: IFormattedFoodData[],
    order: Order,
    orderBy: keyof IFormattedFoodData,
    page: number,
    searched: string,
    rowsPerPage: number
}

class RecordMealTable extends React.Component<FoodTableProps, FoodTableStates> {
    constructor(props: FoodTableProps) {
        super(props);
        this.state = {
            rows: [],
            filteredRows: [],
            order: 'asc',
            orderBy: 'foodName',
            page: 0,
            searched: '',
            rowsPerPage: 10,
        };
    }

    async componentDidMount() {
        const foodData: IFormattedFoodData[] = await this.getFoodData(this.props.id, this.props.token);
        const uniqueFoodNames: string[] = [];
        const uniqueFoodData: IFormattedFoodData[] = [];
        foodData.forEach(food => {
            if (!uniqueFoodNames.includes(food.foodName)) {
                uniqueFoodNames.push(food.foodName);
                uniqueFoodData.push(food);
            }
        })
        this.setState({
            rows: uniqueFoodData,
            filteredRows: uniqueFoodData
        });
    }

    async getFoodData(restaurant_id: string, token: string): Promise<IFormattedFoodData[]> {
        const fetchData = await getFoodsByRestaurant(restaurant_id, token);
        // const fetchData = await getAllFoods(token);
        if (fetchData.message === "Auth failed") {
            console.log("Unable to fetch reviews");
            return [];
        }
        
        const foods = fetchData as IRawFoodData[];
        const formattedFoods: IFormattedFoodData[] = [];
    
        for (const food of foods) {
            formattedFoods.push(this.formatFoodData(food));
        }
        return formattedFoods;
    }

    formatFoodData(food: IRawFoodData): IFormattedFoodData {
        return {
            foodName: food.name,
            allergens: food.allergens === null? 'None' : food.allergens,
            record: <Button variant="outlined" onClick={() => this.addItem(food._id, food.name, food.restaurantId)}>Add</Button>,
            total_cal: food.total_cal,
            fat_g: food.fat_g,
            sat_fat_g: food.sat_fat_g,
            trans_fat_g: food.trans_fat_g,
            sodium_mg: food.sodium_mg,
            carbs_g: food.carbs_g,
            fiber_g: food.fiber_g,
            sugars_g: food.sugars_g,
            protein_g: food.protein_g,
            cholesterol_mg: food.cholesterol_mg,
        }
    }

    addItem(id: string, name: string, restaurantId: string) {
        this.props.addItemEvent(id, name, restaurantId);
    }

    requestSearch(event: any) {
        const searchedVal = event.target.value;
        
        const filteredRows = this.state.rows.filter((row) => {
            return row.foodName.toLowerCase().includes(searchedVal.toLowerCase());
        });
        
        this.setState({
            searched: searchedVal,
            filteredRows: filteredRows,
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
        property: keyof IFormattedFoodData,
    ) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        })
    };

    createSortHandler(property: keyof IFormattedFoodData) {
        return (event: React.MouseEvent<unknown>) => {
            this.handleRequestSort(event, property);
        };
    }

    displayFoodRow(row: IFormattedFoodData) {
        return (
            <TableRow hover role="checkbox" key={row.foodName}>
                {columns.map((column) => {
                    const value = row[column.id];
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    displayFoodRowNutrition(row: IFormattedFoodData) {
        return (
            <span style={{ whiteSpace: 'pre-line' }}>
                {"Total Calories: " + row.total_cal + "\n" +
                "Fat: " + row.fat_g + "\n" +
                "Saturated Fat: " + row.sat_fat_g + "\n" +
                "Trans Fat: " + row.trans_fat_g + "\n" +
                "Sodium: " + row.sodium_mg + "\n" +
                "Carbohydrates: " + row.carbs_g + "\n" +
                "Fiber: " + row.fiber_g + "\n" +
                "Sugar: " + row.sugars_g + "\n" +
                "Protein: " + row.protein_g + "\n" +
                "Cholesterol: " + row.cholesterol_mg}
            </span>
        );
    }

    render() {
        const {
            rows,
            filteredRows,
            order,
            orderBy,
            page,
            searched,
            rowsPerPage
        } = this.state;
        return (
            <Paper sx={{ width: '100%', overflow: 'hidden', padding: '18px 12px 0px 12px' }}>
                <TextField
                    label='Search food'
                    value={searched}
                    size='small'
                    onChange={(e: any) => this.requestSearch(e)}
                />
                <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.align}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                    {headCell.sortDisabled ? <></> :
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={this.createSortHandler(headCell.id)}
                                        >
                                        {headCell.label}
                                        {orderBy === headCell.id ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                        </TableSortLabel>
                                    }
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stableSort(filteredRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    // console.log(rows)
                                    return (
                                        <Tooltip 
                                            TransitionComponent={Zoom} 
                                            title={this.displayFoodRowNutrition(row as IFormattedFoodData)} 
                                            arrow 
                                            followCursor={true} 
                                            placement="top-start">
                                                {this.displayFoodRow(row as IFormattedFoodData)}
                                        </Tooltip>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e: any, newPage: number) => this.handleChangePage(e, newPage)}
                    onRowsPerPageChange={(e: any) => this.handleChangeRowsPerPage(e)}
                />
            </Paper>
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
export default connector(RecordMealTable);
