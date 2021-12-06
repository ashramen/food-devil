import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { State } from '../../store/index';
import TopAppBar from '../topAppBar/topAppBar';
import LockPage from '../lockPage/lockPage';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';

import { getUsername } from '../../api/login';
import { getAllUserMeals } from '../../api/meals';

import MealsGrid from './mealsGrid';
import * as MC from './mealCardSplit';

interface IProfilePageProps extends PropsFromRedux {
}

interface IProfilePageState {
    meals: MC.IRawMealData[];
    username: string;
    viewMeals: boolean;
}


class ProfilePage extends React.Component<IProfilePageProps, IProfilePageState> {
    constructor(props: IProfilePageProps) {
        super(props);
        this.state = {
            meals: [],
            username: '',
            viewMeals: false,
        };
    }

    async componentDidMount() {
        if (!this.props.userId) {
            console.log("user not logged in");
            return;
        }
        const userIdUnboxed = this.props.userId;
        const username = await getUsername(userIdUnboxed);
        const mealData: MC.IRawMealData[] = await this.getMealData(userIdUnboxed, this.props.token);
        this.setState({
            meals: mealData,
            username: username,
        });
    }

    async getMealData(userId: string, token: string): Promise<MC.IRawMealData[]> {
        const fetchData = await getAllUserMeals(userId, token);
        return fetchData.flat().reverse() as MC.IRawMealData[];
    }

    render() {
        const {
            meals,
            username,
            viewMeals,
        } = this.state;
        return (
            <>
                <Box mx={2}>
                    <TopAppBar page='profile' />
                    {this.props.loggedIn ?
                    <>
                        <Grid container mt={15}>
                            <Grid item>
                                <div>Welcome {username}</div>
                                <div>All your meals are listed here. 
                                    <Button onClick={() => this.setState({viewMeals: !viewMeals})}>{viewMeals ? "Show Less" : "View All"}</Button>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {viewMeals ? <MealsGrid meals={meals} /> : <div></div>}
                        </Grid>
                    </> : <LockPage />}
                </Box>
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
export default connector(ProfilePage);