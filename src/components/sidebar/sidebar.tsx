import * as React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiListItemText from '@mui/material/ListItemText';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';

import './styles.css';

interface SidebarProps extends PropsFromRedux{
    page: string;
};

interface SidebarStates {
    open: boolean;
};

export class Sidebar extends React.Component<SidebarProps, SidebarStates> {
    constructor(props: SidebarProps) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleLogInButton = () => {
        if (this.props.loggedIn) {
            this.props.logOut();
        } else {
            // TODO: redirect this to a sign-in page where this.props.logIn() will be called
        }
    };

    sidebarItemStyle = (tab: string) => {
        return (this.props.page === tab? {
            color: 'white'
        }: { color: '#003087' })
    }

    sidebarButtonStyle = (tab: string) => {
        return (this.props.page === tab? {
            backgroundColor: '#003087'
        } : {})
    }

    render() {
        return (
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar sx={{
                    height: 100,
                    bgcolor: '#003087',
                }}>
                    <Toolbar>
                        <Grid container alignItems='center' justifyContent='center'>
                            <Grid item xs={4} style={{display: "flex", justifyContent: "flex-start"}}>
                                <IconButton
                                    className='button'
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={this.handleDrawerOpen}
                                    edge="start"
                                    sx={{
                                        marginTop: 2,
                                    }}
                                >
                                    <MenuIcon className='button'/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h3" component="div" fontFamily='Apple Chancery'
                                    sx={{
                                        marginTop: 3,
                                    }}
                                >
                                    Food Devil
                                </Typography>
                            </Grid>
                            <Grid item xs={4} style={{ display: "flex", justifyContent: "flex-end" }}>
                                {this.props.loggedIn? <div className='displayUser'>Logged in as {this.props.username}</div> : <div></div>}
                                {this.props.page === 'login'? <div></div> : <Link to={this.props.loggedIn? '/' : '/login'} style={{ textDecoration: 'none' }}>
                                    <div className='loginButton'>
                                        <Button variant="text" onClick={() => this.handleLogInButton()}
                                            sx={{
                                                color: 'white',
                                                marginTop: 3,
                                            }}>{this.props.loggedIn? 'Log Out' : 'Log In'}
                                        </Button>
                                    </div>
                                </Link>}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        flexShrink: 0,
                    }}
                    variant="persistent"
                    anchor="left"
                    open={this.state.open}
                    style={{ flex: 1 }}
                >
                    <DrawerHeader>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon sx={{
                                color: '#003087'
                            }}/>
                        </IconButton>
                    </DrawerHeader>
                    <List>
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            <ListItemButton style={this.sidebarButtonStyle('nutrition report')}>
                            <AssessmentIcon sx={this.sidebarItemStyle('nutrition report')}/>
                            <ListItemText primary={'Nutrition Report'} sx={this.sidebarItemStyle('nutrition report')}/>
                            </ListItemButton>
                        </Link>
                        <Link to='/recordmeal' style={{ textDecoration: 'none' }}>
                            <ListItemButton style={this.sidebarButtonStyle('record meal')}>
                            <FastfoodIcon sx={this.sidebarItemStyle('record meal')}/>
                            <ListItemText primary={'Record Meal'} sx={this.sidebarItemStyle('record meal')}/>
                            </ListItemButton>
                        </Link>
                        {<Link to='/restaurants' style={{ textDecoration: 'none' }}>
                            <ListItemButton style={this.sidebarButtonStyle('restaurants')}>
                            <RestaurantIcon sx={this.sidebarItemStyle('restaurants')}/>
                            <ListItemText primary={'Restaurants'} sx={this.sidebarItemStyle('restaurants')}/>
                            </ListItemButton>
                        </Link>}
                    </List>
                </Drawer>
            </Box>
        );
    }
};

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const ListItemText = styled(MuiListItemText)(() => ({
    color: '#003087',
}));

const mapStateToProps = (state: State) => ({
    loggedIn: state.logIn.loggedIn,
    username: state.logIn.username,
});

const mapDispatchToProps = {
    logIn,
    logOut
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Sidebar);