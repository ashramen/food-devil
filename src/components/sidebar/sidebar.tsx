import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import ListItemButton from '@mui/material/ListItemButton';
import MuiListItemText from '@mui/material/ListItemText';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';
import { Link } from 'react-router-dom';
import './styles.css';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const drawerWidth = 160;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const ListItemText = styled(MuiListItemText)(() => ({
    color: 'white'
}));

interface SidebarProps extends PropsFromRedux{
    isLogIn: boolean;
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

    render() {
        return (
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar sx={{
                    height:100,
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
                                {this.props.isLogIn? <div></div> : <Link to={this.props.loggedIn? '/' : '/login'} style={{ textDecoration: 'none' }}>
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
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: 'white'
                        },
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
                            <ListItemButton>
                            <HomeIcon sx={{
                                color: '#003087'
                            }}/>
                            <ListItemText primary={'Home'} sx={{
                                color: '#003087'
                            }}/>
                            </ListItemButton>
                        </Link>
                        <Link to='/addmeal' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                            <FastfoodIcon sx={{
                                color: '#003087'
                            }}/>
                            <ListItemText primary={'Add Meal'} sx={{
                                color: '#003087'
                            }}/>
                            </ListItemButton>
                        </Link>
                        <Link to='/restaurants' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                            <RestaurantIcon sx={{
                                color: '#003087'
                            }}/>
                            <ListItemText primary={'Restaurants'} sx={{
                                color: '#003087'
                            }}/>
                            </ListItemButton>
                        </Link>
                    </List>
                </Drawer>
            </Box>
        );
    }
};

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