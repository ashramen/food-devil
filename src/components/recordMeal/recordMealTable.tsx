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
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import { visuallyHidden } from '@mui/utils';

import { getFoodsByRestaurant } from "../../api/foods";
import { getComparator, stableSort, Order, AllergenNameToImage } from "./recordMealConstants";
import { RestaurantData } from './recordMeal';
import { IRawFoodData } from './recordMeal';

interface Column {
    id: 'foodName' | 'allergens' | 'record';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
    sortDisabled?: boolean;
}

const allAllergens = ['Gluten', 'Eggs', 'Milk', 'Soy', 'Tree Nuts', 'Wheat', 'Peanut', 'Fish', 'Sesame', 'Shellfish'].sort();

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

interface IFormattedFoodData {
    foodName: string;
    // allergens: any[];
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
                variant="text"
                id="logged-in-button"
                aria-controls="logged-in-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
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
    addItemEvent: (food: IRawFoodData) => void;
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
    // allergens: any[],
    allergens: string[],
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
            allergens: [],
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
        const filteredRows = uniqueFoodData.filter((row) => {
            return this.checkFilter(row) && this.checkAllergens(row);
        });
        this.setState({
            rows: uniqueFoodData,
            filteredRows
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
        const fetchData = await getFoodsByRestaurant(restaurant_id);
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
            // allergens: allergensList.map(allergen => <img src={AllergenNameToImage[allergen]} alt="" />),
            allergens: food.allergens === null ? 'None' : food.allergens,
            record: <Button variant="outlined" onClick={() => this.addItem(food)}>Add</Button>,
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

    addItem(food: IRawFoodData) {
        this.props.addItemEvent(food);
    }

    requestSearch(event: any) {
        const searchedVal = event.target.value;
        
        const filteredRows = this.state.rows.filter((row) => {
            return this.checkFilter(row, searchedVal) && this.checkAllergens(row);
        });
        
        this.setState({
            searched: searchedVal,
            filteredRows: filteredRows,
            page: 0
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
                    let value = row[column.id];
                    if (column.id === "allergens") {
                        console.log(typeof(row.allergens));
                        let allergenParam = typeof(row.allergens) === "string" ? "" : row.allergens[0];
                        let allergensList = allergenParam.split(", ");
                        value = allergensList.map(allergen => <img src={AllergenNameToImage[allergen]} alt="" height={35} />);
                    }
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

    checkAllergens(row: IFormattedFoodData) {
        for (const allergen of this.state.allergens) {
            for (const rowAllergen of row.allergens) {
                if (rowAllergen.toLowerCase().includes(allergen.toLowerCase())) {
                    return false;
                }
            } 
        }
        return true;
    }

    checkFilter(row: IFormattedFoodData, searchedVal?: string) {
        if (searchedVal) {
            return row.foodName.toLowerCase().includes(searchedVal.toLowerCase());
        }
        if (searchedVal === '') {
            return true
        }
        return row.foodName.toLowerCase().includes(this.state.searched.toLowerCase());
    }

    createCheckBox(allergen: string) {
        const { rows, allergens } = this.state;
        return (
            <>
                <Checkbox
                    onChange={(e: any) => {
                        if (e.target.checked) {
                            allergens.push(allergen);
                            this.setState({ allergens })
                        } else {
                            const index = allergens.indexOf(allergen);
                            if (index > -1) {
                                allergens.splice(index, 1);
                                this.setState({ allergens });
                            }
                        }
                        const filteredRows = rows.filter((row) => {
                            return this.checkFilter(row) && this.checkAllergens(row);
                        });
                        this.setState({ filteredRows, page: 0 });
                    }}
                />
                <Typography>{allergen}</Typography>
            </>
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
                    <Grid item xs={3}>
                        <RestaurantMenu onClick={(e: any) => this.setState({ selectedRestaurant: e.target.id, page: 0 })} restaurantName={selectedRestaurant} allRestaurants={this.props.allRestaurants.map((restaurant) => restaurant.name)}/>
                    </Grid>
                    <Grid item xs={7}  style={{ display: "flex", justifyContent: "flex-start" }}>
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
                    <Grid item xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
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
                <Grid container>
                    <Grid item xs={1}>
                        <Typography mt={3}>Allergies?</Typography>
                    </Grid>
                    {allAllergens.map((allergen) => <Grid item xs={1}>{this.createCheckBox(allergen)}</Grid>)}
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
