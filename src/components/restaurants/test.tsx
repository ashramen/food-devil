import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

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
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

import { getFoodsByRestaurant } from "../../api/foods";
import { getComparator, stableSort, Order } from "./restaurantConstants";
import { getReviews } from '../../api/reviews';

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
    name: string;
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


class RecordMealTable extends React.Component<MealsOrderedProps, MealsOrderedState> {
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


    requestSearch(event: any) {
        console.log(this.state.rows);
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
        return (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TextField
                    name='search'
                    value={searched}
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
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    console.log(rows)
                                    return (
                                        <TableRow hover role="checkbox" key={row.id}>
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
