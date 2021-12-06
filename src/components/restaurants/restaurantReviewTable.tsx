import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { Order, getFormattedDate } from "./restaurantConstants";
import RestaurantReviewCard from './restaurantReviewCard';
import { getReviews, upvoteReview } from '../../api/reviews';
import { getUsername } from '../../api/login';
import { IconButton } from "@mui/material";
import Button from '@mui/material/Button';
interface IRawReviewData {
    _id: string,
    createdAt: string,
    description: string,
    is_anonymous: boolean,
    restaurant_id: string,
    stars: number,
    helpful: number,
    updatedAt: string,
    user_id: string,
    message: string,
}


export interface IReviewData {
    id: string;
    review: string;
    rating: number;
    helpful: number;
    username: string;
    date: string;
    upvote: any;
    hasUpvote: any;
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
            order: 'desc',
            orderBy: 'rating',
            page: 1,
            searched: '',
            rowsPerPage: 5,
            originalRows: []
        };

        this.onSortByMostRecent = this.onSortByMostRecent.bind(this);
        this.onSortByMostHelpful = this.onSortByMostHelpful.bind(this);
        this.onSortByHighestRating = this.onSortByHighestRating.bind(this);
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
        uniqueReviewData.sort((a, b) => (a.helpful > b.helpful) ? -1 : 1);
        this.props.handleAverageRatingChange(sumOfRatings / uniqueReviewData.length);
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
            const formattedReview = this.formatReviewData(review);
            if (!review.is_anonymous) {
                const actualUsername = await getUsername(formattedReview.username);
                if (typeof actualUsername !== "object") {
                    /**
                     * this is a bit of a hack
                     * DB will send a string if it finds a valid username from user_id
                     * but will instead send an object with an error message if not
                     */
                    formattedReview.username = actualUsername;
                }
            }
            formattedReviews.push(formattedReview);
        }
        return formattedReviews;
    }

    formatReviewData(review: IRawReviewData): IReviewData {
        if (review.is_anonymous) {
            review.user_id = "Anonymous";
        }
        const formattedReview = {
            id: review._id,
            review: review.description,
            rating: review.stars,
            helpful: review.helpful,
            username: review.user_id,   // TODO: this is the user_id, not the username; need new api method
            date: getFormattedDate(new Date(review.updatedAt)),
            upvote: this.props.loggedIn ? (
                <IconButton color="default" onClick={() => this.upvoteReview(formattedReview)}>
                    <ThumbUpIcon />
                </IconButton>
            ) : (
                <IconButton disabled>
                    <ThumbUpIcon />
                </IconButton>
            ),
            hasUpvote: false,
        }
        return formattedReview;
    }

    upvoteReview(review: IReviewData) {
        const rows = this.state.rows;
        const row = rows.find(row => row === review);
        if (row && !row.hasUpvote) {
            upvoteReview(review.id, this.props.token);
            row.upvote = <IconButton color="primary">
                <ThumbUpIcon />
            </IconButton>
            row.hasUpvote = true;
            this.setState({ rows: rows });
        }
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

    onSortByMostRecent() {
        this.setState({ rows: this.state.rows.sort((a, b) => (a.date > b.date) ? -1 : 1) });
    }

    onSortByMostHelpful() {
        this.setState({ rows: this.state.rows.sort((a, b) => (a.helpful > b.helpful) ? -1 : 1) });
    }

    onSortByHighestRating() {
        this.setState({ rows: this.state.rows.sort((a, b) => (a.rating > b.rating) ? -1 : 1) });
    }

    render() {
        const {
            rows,
            page,
            searched,
            rowsPerPage
        } = this.state;

        const paginatedRows = rows.slice((page - 1) * rowsPerPage, Math.min((page - 1) * rowsPerPage + rowsPerPage, rows.length));
        return (
            <>
                <Grid container sx={{ padding: '16px' }} alignItems='center' justifyContent='center'>
                    <Grid item xs={8} style={{ display: "flex", justifyContent: "flex-start", alignItems: 'center' }}>
                        <TextField
                            name='search'
                            label='Search for Keyword'
                            variant='outlined'
                            value={searched}
                            onChange={(e: any) => this.requestSearch(e)}
                            size="small"
                            sx={{
                                width: 250,
                                marginRight: 3
                            }}
                        />
                        <Button onClick={() => this.onSortByMostHelpful()}>Sort By Most Helpful </Button>
                        <Button onClick={() => this.onSortByMostRecent()}>Sort By Most Recent </Button>
                        <Button onClick={() => this.onSortByHighestRating()}>Sort By Highest Rating </Button>
                    </Grid>
                    <Grid item xs={4} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Pagination count={Math.ceil(rows.length / rowsPerPage)} shape="rounded" page={page}
                            onChange={(e: any, newPage: number) => this.handleChangePage(e, newPage)} />
                    </Grid>
                </Grid>
                {paginatedRows.map((row: IReviewData, index: number) =>
                    <RestaurantReviewCard reviewData={row} index={index} upvoteReview={(row) => this.upvoteReview(row)} />
                )}
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
export default connector(RestaurantReviewTable);