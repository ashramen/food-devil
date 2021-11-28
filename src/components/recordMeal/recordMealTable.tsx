import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { styled, alpha } from '@mui/material/styles';
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
import { visuallyHidden } from '@mui/utils';

import { getFoodsByRestaurant } from "../../api/foods";
import { getComparator, stableSort, Order } from "./recordMealConstants";
import { RestaurantData } from './recordMeal';

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

interface IRestaurantMenu {
    onClick: any;
    restaurantName: string;
    allRestaurants: string[];
};

const RestaurantMenuList = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
      }}
      transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
      }}
      {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 0,
      marginTop: theme.spacing(1),
      minWidth: 100,
      maxHeight: 300,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
}));

function RestaurantMenu(props: IRestaurantMenu) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="logged-in-button"
                aria-controls="logged-in-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="text"
                sx={{
                    color: '#003087',
                }}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {props.restaurantName}
            </Button>
            <RestaurantMenuList
                id="logged-in-menu"
                MenuListProps={{
                    'aria-labelledby': 'logged-in-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {props.allRestaurants.map((restaurant: string) => 
                    <MenuItem id={restaurant} onClick={(e) => {props.onClick(e); handleClose()}} disableRipple>
                        {restaurant}
                    </MenuItem>
                )}
            </RestaurantMenuList>
        </div>   
    )
}

interface FoodTableProps extends PropsFromRedux{
    allRestaurants: RestaurantData[];
    addItemEvent: (id: string, name: string, restaurantId: string) => void;
}

interface FoodTableStates {
    rows: IFormattedFoodData[],
    filteredRows: IFormattedFoodData[],
    order: Order,
    orderBy: keyof IFormattedFoodData,
    page: number,
    searched: string,
    rowsPerPage: number,
    selectedRestaurant: string,
    showNutrition: boolean,
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
            selectedRestaurant: 'Beyu Blue Coffee',
            showNutrition: true,
        };
    }

    async fillTable(id: string) {
        const foodData: IFormattedFoodData[] = await this.getFoodData(id, this.props.token);
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

    async componentDidMount() {
        const beyuId: string = this.props.allRestaurants.filter((restaurant) => restaurant.name === 'Beyu Blue Coffee')[0]._id;
        this.fillTable(beyuId);
    }

    async componentDidUpdate(prevProps: FoodTableProps, prevStates: FoodTableStates) {
        if (prevStates.selectedRestaurant !== this.state.selectedRestaurant) {
            const newId: string = this.props.allRestaurants.filter((restaurant) => restaurant.name === this.state.selectedRestaurant)[0]._id;
            this.fillTable(newId);
        }
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
                {"Total Calories: " + row.total_cal + " cal\n" +
                "Fat: " + row.fat_g + " g\n" +
                "Saturated Fat: " + row.sat_fat_g + " g\n" +
                "Trans Fat: " + row.trans_fat_g + " g\n" +
                "Sodium: " + row.sodium_mg + " mg\n" +
                "Carbohydrates: " + row.carbs_g + " g\n" +
                "Fiber: " + row.fiber_g + " g\n" +
                "Sugar: " + row.sugars_g + " g\n" +
                "Protein: " + row.protein_g + " g\n" +
                "Cholesterol: " + row.cholesterol_mg + " mg"}
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
            rowsPerPage,
            selectedRestaurant,
            showNutrition,
        } = this.state;
        return (
            <Paper sx={{ width: '100%', overflow: 'hidden', padding: '18px 12px 0px 12px' }}>
                <Grid container>
                    <Grid item xs={9}>
                    <TextField
                        label='Search food'
                        value={searched}
                        size='small'
                        onChange={(e: any) => this.requestSearch(e)}
                        sx={{
                            width: '100%'
                        }}
                    />
                    </Grid>
                    <Grid item xs={3} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <RestaurantMenu onClick={(e: any) => this.setState({ selectedRestaurant: e.target.id })} restaurantName={selectedRestaurant} allRestaurants={this.props.allRestaurants.map((restaurant) => restaurant.name)}/>
                    </Grid>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <FormControlLabel
                            label="Show Nutrition"
                            control={<Checkbox 
                                defaultChecked 
                                checked={showNutrition} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ showNutrition: !showNutrition})}
                            />}
                            labelPlacement="start"
                        />
                    </Grid>
                </Grid>
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
                                    return (
                                        showNutrition 
                                        ? <Tooltip 
                                            TransitionComponent={Zoom} 
                                            title={this.displayFoodRowNutrition(row as IFormattedFoodData)} 
                                            arrow 
                                            followCursor={true} 
                                            placement="top-start">
                                                {this.displayFoodRow(row as IFormattedFoodData)}
                                        </Tooltip>
                                        : this.displayFoodRow(row as IFormattedFoodData)
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={filteredRows.length}
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
