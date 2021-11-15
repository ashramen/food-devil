import React from 'react';

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

import { postReview } from "../../api/reviews";

interface RestaurantsReviewPopupProps extends PropsFromRedux {
    name: string;
    handleClose: () => void;
    open: boolean;
}

interface RestaurantsReviewPopupState {
    stars: number | null;
    textField: string | null;
}

class RestaurantsReviewPopup extends React.Component<RestaurantsReviewPopupProps, RestaurantsReviewPopupState> {

    constructor(props: RestaurantsReviewPopupProps) {
        super(props);

        this.state = {
            stars: 3,
            textField: ""
        };
        this.onStarsChange = this.onStarsChange.bind(this);
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        const beyublue_id = 0x616ad5d1d252dea11b9043db;
        let beyublue_id_string = beyublue_id.toString();

        console.log(this.state);
        if (this.props.loggedIn) {
            if (this.props.userId === null || this.state.textField === null || this.state.stars === null) {
                console.log("review not submitted; at least one of `userId`, `textField`, or `stars` is null")
            } else {
                const posted_review = await postReview(this.props.userId, beyublue_id_string, this.state.textField, this.state.stars, false, this.props.token);
                console.log("review has been posted successfully");
                console.log(posted_review);
            }
        }
    }

    render() {

        const { handleClose, open } = this.props;

        const {
            textField,
            stars
        } = this.state;

        return (
            <Dialog onClose={handleClose} open={open}>
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
                            <Button variant="contained" onClick={this.onSubmit}>Submit</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog >
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
export default connector(RestaurantsReviewPopup);
