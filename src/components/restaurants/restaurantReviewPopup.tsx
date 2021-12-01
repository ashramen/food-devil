import React from 'react';
import Dialog from '@mui/material/Dialog';
import { connect, ConnectedProps } from 'react-redux';
import RestaurantReviewField from './restaurantReviewField';
import { State } from '../../store/index';

interface RestaurantsReviewPopupProps extends PropsFromRedux {
    name: string;
    handleClose: () => void;
    open: boolean;
    id: string;
}

class RestaurantsReviewPopup extends React.Component<RestaurantsReviewPopupProps> {

    constructor(props: RestaurantsReviewPopupProps) {
        super(props);
    }

    render() {

        const { handleClose, open, name, id } = this.props;

        return (
            <Dialog onClose={handleClose} open={open}>
                <RestaurantReviewField name={name} id={id.toString()} />
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
