import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiListItemText from '@mui/material/ListItemText';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';

import './styles.css';

interface TopAppBarProps extends PropsFromRedux, RouteComponentProps {
    page: string;
};

interface TopAppBarStates {
    open: boolean;
};

interface ILogInOutMenu {
    onClick: any;
    loggedIn: boolean;
    username: string | null;
};

const LogOutMenuList = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
      }}
      transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
      }}
      {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 0,
      marginTop: theme.spacing(1),
      minWidth: 100,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
}));

function LogOutMenu(props: ILogInOutMenu) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="logged-in-button"
                aria-controls="logged-in-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="text"
                sx={{
                    color: 'white',
                    marginTop: 3,
                }}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {props.username}
            </Button>
            <LogOutMenuList
                id="logged-in-menu"
                MenuListProps={{
                    'aria-labelledby': 'logged-in-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={props.onClick} disableRipple>
                    Log Out
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    Other Items We Wanna Add
                </MenuItem>
            </LogOutMenuList>
        </div>   
    )
}

function LogInOutButton(props: ILogInOutMenu) {
    if (props.loggedIn) {
        return(
            <LogOutMenu 
                onClick={props.onClick}
                loggedIn={props.loggedIn}
                username={props.username}
            />
        )
    } else {
        return(
            <Button variant="text" onClick={props.onClick}
                sx={{
                    color: 'white',
                    marginTop: 3,
                }}>Log In
            </Button>
        )
    }
}

export class TopAppBar extends React.Component<TopAppBarProps, TopAppBarStates> {
    constructor(props: TopAppBarProps) {
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
            this.props.history.push('/login');
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
                            <Grid item xs={2} style={{display: "flex", justifyContent: "flex-start"}}>
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
                            <Grid item xs={8}>
                                <Typography variant="h3" component="div" fontFamily='Apple Chancery'
                                    sx={{
                                        marginTop: 3,
                                    }}
                                >
                                    Food Devil
                                </Typography>
                            </Grid>
                            <Grid item xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                                {this.props.page === 'login'? <div></div> :
                                <div className='loginButton'>
                                    <LogInOutButton 
                                        onClick={() => this.handleLogInButton()} 
                                        loggedIn={this.props.loggedIn} 
                                        username={this.props.username ? this.props.username : null}
                                    />
                                </div>}
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
                        <ListItemButton style={this.sidebarButtonStyle('nutrition report')} onClick={() => {this.props.history.push('/')}}>
                            <AssessmentIcon sx={this.sidebarItemStyle('nutrition report')}/>
                            <ListItemText primary={'Nutrition Report'} sx={this.sidebarItemStyle('nutrition report')}/>
                        </ListItemButton>
                        <ListItemButton style={this.sidebarButtonStyle('record meal')} onClick={() => {this.props.history.push('/recordmeal')}}>
                            <FastfoodIcon sx={this.sidebarItemStyle('record meal')}/>
                            <ListItemText primary={'Record Meal'} sx={this.sidebarItemStyle('record meal')}/>
                        </ListItemButton>
                        <ListItemButton style={this.sidebarButtonStyle('restaurants')} onClick={() => {this.props.history.push('/restaurants')}}>
                            <RestaurantIcon sx={this.sidebarItemStyle('restaurants')}/>
                            <ListItemText primary={'Restaurants'} sx={this.sidebarItemStyle('restaurants')}/>
                        </ListItemButton>
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
export default connector(withRouter(TopAppBar));