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

interface sidebarProps extends PropsFromRedux {
};

interface sidebarStates {
    open: boolean;
};

export class Sidebar extends React.Component<sidebarProps, sidebarStates> {
    constructor(props: sidebarProps) {
        super(props);
        this.state = {
            open: true
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
            this.props.logIn('username');
            window.location.href = "/login";
        }
    };

    render() {
        return (
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    edge="start"
                    sx={{
                    marginRight: '36px',
                    ...(this.state.open && { display: 'none' }),
                    }}
                >
                <MenuIcon />
                </IconButton>
                </Toolbar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#003087'
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
                                color: 'white'
                            }}/>
                        </IconButton>
                    </DrawerHeader>
                    <List>
                        <ListItemButton component="a" href="/">
                        <HomeIcon sx={{
                            color: 'white'
                        }}/>
                        <ListItemText primary={'Home'}/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/recorddiet">
                        <FastfoodIcon sx={{
                            color: 'white'
                        }}/>
                        <ListItemText primary={'Record Diet'}/>
                        </ListItemButton>
                        <ListItemButton component="a" href="/restaurants">
                        <RestaurantIcon sx={{
                            color: 'white'
                        }}/>
                        <ListItemText primary={'Restaurants'}/>
                        </ListItemButton>
                    </List>
                </Drawer>
                <Button variant="text" onClick={() => this.handleLogInButton()}>{this.props.loggedIn? 'Log Out' : 'Log In'}</Button>
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