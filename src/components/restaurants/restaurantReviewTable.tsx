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
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import SearchBar from "material-ui-search-bar";

import { getReviews } from "../../api/reviews";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


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
    is_anonymous: Boolean,
    restaurant_id: string,
    stars: number,
    updatedAt: string,
    user_id: string,
}

interface Data {
    review: string;
    rating: number;
    username: string;
    date: string;
}



async function getReviewData (restaurant_id: string, token: string): Promise<Data[]> {
    const beyublue_id = 0x616ad5d1d252dea11b9043db;
    let beyublue_id_string = beyublue_id.toString();
    const reviews: IRawReviewData[] = await getReviews(beyublue_id_string, token) as IRawReviewData[];
    
    const formattedReviews: Data[] = [];

    for (const review of reviews) {
        formattedReviews.push(formatReviewData(review));
    }
    return formattedReviews;
}

function formatReviewData (review: IRawReviewData): Data {
    return {
        review: review.description,
        rating: review.stars,
        username: review.user_id,   // TODO: this is the user_id, not the username; need new api method
        date: review.updatedAt,
    }
}

// TODO: delete these 
function createDataManual(
    review: string,
    rating: number,
    username: string,
    date: string
): Data {
    return { review, rating, username, date };
}

const dataRowsManual: Data[] = [
    createDataManual('Next his only boy meet the fat rose when. Do repair at we misery wanted remove remain income. Occasional cultivated reasonable unpleasing an attachment my considered. Having ask and coming object seemed put did admire figure. Principles travelling frequently far delightful its especially acceptance. Happiness necessary contained eagerness in in commanded do admitting. Favourable continuing difficulty had her solicitude far. Nor doubt off widow all death aware offer. We will up', 2.5, "username", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 2.5, "username", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 1, "aqibisbiqa", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 2.5, "username", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 2.5, "username", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 2.5, "username", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 2.5, "username", "11/10/2021"),
    createDataManual('Next his only boy meet the fat rose when', 2.5, "username", "11/10/2021"),
];


interface RestaurantReviewTableProps extends PropsFromRedux{
    name: string;
}

function RestaurantReviewTable(props: RestaurantReviewTableProps) {
    const [rows, setRows] = React.useState<Data[]>([]);

    React.useEffect(() => {
        const sample_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFxaWJpc2JpcWEiLCJ1c2VySWQiOiI2MTcyMTQ2NTM3Y2MwNDZjMzczZDg2YzIiLCJpYXQiOjE2MzY5MzQ5NDUsImV4cCI6MTYzNzAyMTM0NX0.TZcyRCzsAHB_Q_YYQ9429wh0Nm9Ftx9VTjiMjtM6Ppo";
        
        // TODO: Should user have to be logged in to see review?
        // If so, then we use `props.token` as shown below:
        // But otherwise, we can just use a sample one
        /** getReviewData("", props.token).then(setRows); **/        

        getReviewData("", sample_token).then(setRows);
    }, []);

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('review');
    const [page, setPage] = React.useState(0);
    const [searched, setSearched] = React.useState<string>("");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const requestSearch = (searchedVal: string) => {
        const filteredRows = rows.filter((row) => {
            return row.review.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setRows(filteredRows);
    };

    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            handleRequestSort(event, property);
        };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
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
                                        onClick={createSortHandler(headCell.id)}
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.username}>
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const mapStateToProps = (state: State) => ({
    loggedIn: state.logIn.loggedIn,
    token: state.logIn.token,
    userId: state.logIn.userId,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default (connector(RestaurantReviewTable));
