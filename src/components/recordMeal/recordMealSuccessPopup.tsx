import React from 'react';
import Dialog from '@mui/material/Dialog';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';

interface IRecordMealSuccessPopup extends PropsFromRedux {
    handleClose: () => void;
    open: boolean;
}

class RecordMealSuccessPopup extends React.Component<IRecordMealSuccessPopup> {

    render() {

        const { handleClose, open } = this.props;

        return (
            <Dialog onClose={handleClose} open={open}>
                <div>Your meal was successfully recorded!</div>
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
export default connector(RecordMealSuccessPopup);
