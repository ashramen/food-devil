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

import { getComparator, stableSort, Order, getFormattedDate } from "./restaurantConstants";
import { getReviews } from '../../api/reviews';

interface Column {
    id: 'review' | 'rating' | 'username' | 'date';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'review', label: 'Review', minWidth: 250, maxWidth: 300 },
    { id: 'rating', label: 'Rating', minWidth: 10, maxWidth: 100 },
    {
        id: 'username',
        label: 'Username',
        minWidth: 170,
        maxWidth: 200,
        align: 'right'
    },
    {
        id: 'date',
        label: 'Date Posted',
        minWidth: 170,
        maxWidth: 200,
        align: 'right'
    }
];

interface IRawReviewData {
    _id: string,
    createdAt: string,
    description: string,
    is_anonymous: boolean,
    restaurant_id: string,
    stars: number,
    updatedAt: string,
    user_id: string,
    message: string,
}


interface IReviewData {
    review: string;
    rating: number;
    username: string;
    date: string;
}

function formatReviewData(review: IRawReviewData): IReviewData {
    if (review.is_anonymous) {
        review.user_id = "Anonymous";
    }
    return {
        review: review.description,
        rating: review.stars,
        username: review.user_id,   // TODO: this is the user_id, not the username; need new api method
        date: getFormattedDate(new Date(review.updatedAt)),
    }
}
interface RestaurantReviewTableProps extends PropsFromRedux {
    name: string;
    id: string;
    handleAverageRatingChange: (averageRating: number) => void;
}

interface RestaurantReviewTableStates {
    rows: IReviewData[],
    order: Order,
    orderBy: keyof IReviewData,
    page: number,
    searched: string,
    rowsPerPage: number,
    originalRows: IReviewData[]
}

class RestaurantReviewTable extends React.Component<RestaurantReviewTableProps, RestaurantReviewTableStates> {
    constructor(props: RestaurantReviewTableProps) {
        super(props);
        this.state = {
            rows: [],
            order: 'asc',
            orderBy: 'date',
            page: 0,
            searched: '',
            rowsPerPage: 5,
            originalRows: []
        };
    }

    async componentDidMount() {
        const reviewData: IReviewData[] = await this.getReviewData(this.props.id, this.props.token);
        const reviewNames: string[] = [];
        const uniqueReviewData: IReviewData[] = [];
        let sumOfRatings = 0.0
        reviewData.forEach(review => {
            if (!reviewNames.includes(review.review)) {
                reviewNames.push(review.review);
                uniqueReviewData.push(review);
            }
            sumOfRatings += review.rating;
        })
        this.props.handleAverageRatingChange(sumOfRatings / uniqueReviewData.length)
        this.setState({
            rows: uniqueReviewData,
            originalRows: uniqueReviewData
        });
    }

    async getReviewData(restaurant_id: string, token: string): Promise<IReviewData[]> {
        const fetchData = await getReviews(restaurant_id, token);
        if (fetchData.message === "Auth failed") {
            console.log("Unable to fetch reviews");
            return [];
        }
        const reviews = fetchData as IRawReviewData[];
        const formattedReviews: IReviewData[] = [];

        for (const review of reviews) {
            formattedReviews.push(formatReviewData(review));
        }
        return formattedReviews;
    }

    requestSearch(event: any) {
        const searchedVal = event.target.value;

        const filteredRows = this.state.originalRows.filter((row) => {
            return row.review.toLowerCase().includes(searchedVal.toLowerCase());
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
        property: keyof IReviewData,
    ) {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        })
    };

    createSortHandler(property: keyof IReviewData) {
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
                                    return (
                                        <TableRow hover role="checkbox" key={row.review}>
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
export default connector(RestaurantReviewTable);
