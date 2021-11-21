import React from 'react';
import Dialog from '@mui/material/Dialog';
import { connect, ConnectedProps } from 'react-redux';
import RestaurantReviewField from './restaurantReviewField';
import { State } from '../../store/index';

interface RestaurantsReviewPopupProps extends PropsFromRedux {
    name: string;
    handleClose: () => void;
    open: boolean;
}

class RestaurantsReviewPopup extends React.Component<RestaurantsReviewPopupProps> {

    constructor(props: RestaurantsReviewPopupProps) {
        super(props);
    }

    render() {

        const { handleClose, open, name } = this.props;

        return (
            <Dialog onClose={handleClose} open={open}>
                <RestaurantReviewField name={name} />
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
