import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import React from 'react';
import { IReviewData } from './restaurantReviewTable';

interface RestaurantReviewCardProps {
    reviewData: IReviewData;
    index: number;
    upvoteReview: (review: IReviewData) => void;
};

interface RestaurantReviewCardStates {
    fade: boolean;
}

class RestaurantReviewCard extends React.Component<RestaurantReviewCardProps, RestaurantReviewCardStates> {
    constructor(props: RestaurantReviewCardProps) {
        super(props);
        this.state = {
            fade: false
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ fade: true }), 150 * this.props.index);
    }

    render() {
        const {
            reviewData,
            upvoteReview
        } = this.props;
        const {
            review,
            rating,
            helpful,
            username,
            date,
        } = reviewData;
        const { fade } = this.state;
        return (
            <>
                <Fade in={fade} timeout={300}>
                    <Card sx={{ width: '100%', marginTop: 1 }}>
                        <CardActionArea>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-start" }}>
                                        <Rating name='restaurant-average-rating' value={reviewData.rating} precision={0.5} size="large" readOnly />
                                    </Grid>
                                    <Grid item xs={6} mt={0.5} style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Typography variant="body2" component="div">
                                            {username + ' on ' + date}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} mt={2} ml={1} style={{ display: "flex", justifyContent: "flex-start" }}>
                                        <Typography variant="body2" component="div" fontSize={15}>
                                            {review}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11} style={{ display: "flex", justifyContent: "flex-end" }}>
                                        {reviewData.upvote}
                                    </Grid>
                                    <Grid item xs={1} style={{ display: "flex", justifyContent: "flex-start" }} mt={1.5}>
                                        {reviewData.helpful}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Fade>
            </>
        );
    }
}


export default RestaurantReviewCard;
