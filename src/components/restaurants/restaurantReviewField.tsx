import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

import { getReviews, postReview } from "../../api/reviews";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

//this is a hack but I don't know how to fix it lmao
interface RestaurantReviewFieldProps extends PropsFromRedux {
    name: string;
    id: string;
}

interface RestaurantReviewFieldState {
    stars: number | null;
    textField: string | null;
    anon: boolean
}

class RestaurantReviewField extends React.Component<RestaurantReviewFieldProps, RestaurantReviewFieldState> {

    constructor(props: RestaurantReviewFieldProps) {
        super(props);

        this.state = {
            stars: 3,
            textField: "",
            anon: false
        };
        this.onStarsChange = this.onStarsChange.bind(this);
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAnonChange = this.onAnonChange.bind(this);
    }
    onAnonChange() {
        const anonPrev = this.state.anon;
        this.setState({ anon: !anonPrev })
    }

    onTextFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            textField: e.target.value
        })
    }

    onStarsChange(newValue: number | null) {
        if (newValue != null) {
            this.setState({
                stars: newValue
            });
        }
    }

    async onSubmit() {
        // TODO: need to replace hardcoded restaurant_id's with some other prop
        // This other prop can be based 
        //   on the current url (using `window.location.href`)
        //   or using an id sent from 'restaurantBox.tsx`
        console.log(this.state);
        console.log(this.props);
        if (this.props.loggedIn) {
            if (this.state.textField === null || this.state.stars === null) {
                console.log("review not submitted; at least one of `textField` or `stars` is null somehow");
            } else if (this.props.userId === null) {
                console.log("review not submitted; user is logged in but the `userId` is null somehow");
            } else {
                let posted_review = undefined;
                if (this.state.textField !== "") {
                    posted_review = await postReview(this.props.userId, this.props.id, this.state.textField, this.state.stars, this.state.anon, this.props.token);
                }
                const p = await getReviews(this.props.id, this.props.token);
                console.log("review has been posted successfully");
            }
        } else {
            // TODO: Let user know that they can't submit review without logging in
            console.log("review not submitted, user not logged in");
        }
    }

    render() {


        const {
            textField,
            stars,
            anon
        } = this.state;

        return (
            <Grid container
                spacing={1}
                direction="column"
                alignItems="center"
                justifyContent="center">
                <Grid item xs={12}>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '50ch' },
                            my: 2
                        }}
                        m={2}
                        pt={1}
                        noValidate
                        autoComplete="off"
                    > <TextField
                            id="outlined-multiline-static"
                            label="Write Review Here"
                            multiline
                            value={textField}
                            onChange={this.onTextFieldChange}
                            rows={4}
                        />
                    </Box>
                </Grid>
                <Grid container
                    alignItems="center"
                    justifyContent="center">
                    <Grid item xs={6}>
                        <Typography component="legend">Rating</Typography>
                        <Rating
                            name="simple-controlled"
                            value={stars}
                            onChange={(event, newValue) => {
                                this.onStarsChange(newValue);
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            label="Anonymous?"
                            control={
                                <Checkbox
                                    checked={anon}
                                    onChange={this.onAnonChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                        />
                        <Button variant="contained" onClick={this.onSubmit}>Submit</Button>
                    </Grid>
                </Grid>
            </Grid>
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
export default connector(RestaurantReviewField);
