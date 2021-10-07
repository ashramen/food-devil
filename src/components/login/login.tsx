import React from "react";
import './styles.css';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';
import { Link } from 'react-router-dom';
import IconButton from "@mui/material/IconButton";
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '../sidebar/sidebar';
import Card from '@mui/material/Card';

interface LoginProps extends PropsFromRedux {};

interface LoginStates {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  newAccount: boolean;
  correctLogIn: boolean;
  correctAccount: boolean;
  accountCreated: boolean;
};

class Login extends React.Component<LoginProps, LoginStates> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      newAccount: false,
      correctLogIn: true,
      correctAccount: true,
      accountCreated: false,
    };
  };

  validUserInfo = () => {
    // TODO: Implement this when backend is implemented
    return (this.state.username === 'CaffeineOverflow'
    && this.state.password === 'cs316');
  }

  correctLogInInfo = () => {
    // TODO: Implement this when backend is implemented
    return (this.state.username
      && this.state.password
      && this.validUserInfo()
    ) as boolean;
  }

  correctAccountInfo = () => {
    // TODO: Also implement unique username check
    const {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    } = this.state;
    return (firstName
      && lastName
      && username
      && password
      && confirmPassword
      && password === confirmPassword
    ) as boolean;
  }
  
  handleLogIn = () => {
    if (this.state.newAccount) {
      if (this.correctAccountInfo()) {
        // TODO: Create Account once backend is implemented
        this.setState({
          newAccount: false,
          accountCreated: true
        });
      } else {
        this.setState({correctAccount: false});
      }
    } else {
      if (this.correctLogInInfo()) {
        this.props.logIn(this.state.username);
      } else {
        this.setState({correctLogIn: false});
      }
    }
  }

  handleSwitch = () => {
    this.setState({
      newAccount: !this.state.newAccount
    });
  };

  render() {
    const {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      newAccount,
      correctLogIn,
      correctAccount,
      accountCreated
    } = this.state;
    const errorMessage: string = (
      !(username && password && (!newAccount || (firstName && lastName && confirmPassword)))?
      'One of the required fields is empty.' : 
      newAccount && password !== confirmPassword?
      "Passwords don't match." :
      !this.validUserInfo()?
      'Incorrect username or password.' :
      'Username is already taken.'
    );
    return (
      <>
        <Sidebar isLogIn={true}/>
        <Grid container alignItems='center' direction="column">
          <Card className='card' sx={{
            maxWidth: 350,
            boxShadow: 5,
            marginTop: 5,
          }}>
            <h3 className='subtitle'>{newAccount? 'Create Account' : 'Log In'}</h3>
            <Grid container
              spacing={2}
              direction='row'
              alignItems='center'
              justifyContent='center'
            >
              {correctLogIn && correctAccount? <div></div> :
                <Grid item xs={12}>
                  <Grid container justifyContent='center'>
                    <Alert
                      severity='error'
                      action={
                        <IconButton
                          aria-label='close'
                          color='inherit'
                          size='small'
                          onClick={() => {
                            this.setState({
                              correctLogIn: true,
                              correctAccount: true
                            });
                          }}
                        >
                          <CloseIcon fontSize='inherit' />
                        </IconButton>
                      }
                      style ={{width: '75%'}}
                    >
                      {errorMessage}
                    </Alert>
                  </Grid>
                </Grid>}
              {accountCreated?
                <Grid item xs={12}>
                  <Grid container justifyContent='center'>
                    <Alert
                      severity='success'
                      action={
                        <IconButton
                          aria-label='close'
                          color='inherit'
                          size='small'
                          onClick={() => {
                            this.setState({
                              accountCreated: false,
                            });
                          }}
                        >
                          <CloseIcon fontSize='inherit' />
                        </IconButton>
                      }
                      style ={{width: '75%'}}
                    >
                      Account Successfully Created
                    </Alert>
                  </Grid>
                </Grid> : <div></div>}
              {newAccount?
              <><Grid item xs={12}>
                  <TextField
                    required
                    label='First Name'
                    id='first_name'
                    variant='standard'
                    onChange={(e) => { this.setState({ firstName: e.target.value }); } }
                    type='text'
                    style={{ width: '75%' }} />
                </Grid><Grid item xs={12}>
                    <TextField
                      required
                      label='Last Name'
                      id='last_name'
                      variant='standard'
                      onChange={(e) => { this.setState({ lastName: e.target.value }); } }
                      type='text'
                      style={{ width: '75%' }} />
                  </Grid></>
              : <div></div>}
              <Grid item xs={12}>
                <TextField
                  required
                  label='Username'
                  id='username'
                  variant='standard'
                  onChange={(e) => {this.setState({username: e.target.value})}}
                  type='text'
                  style ={{width: '75%'}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  label='Password'
                  id='password'
                  variant='standard'
                  onChange={(e) => {this.setState({password: e.target.value})}}
                  type='password'
                  style ={{width: '75%'}}
                />
              </Grid>
              {newAccount? <Grid item xs={12}>
                <TextField
                  required
                  label='Confirm Password'
                  id='confirm_password'
                  variant='standard'
                  onChange={(e) => {this.setState({confirmPassword: e.target.value})}}
                  type='password'
                  style ={{width: '75%'}}
                />
              </Grid>: <div></div>}
              <Grid item xs={12}>
                <Link to={!newAccount && this.correctLogInInfo()? '/' : '/login'} style={{ textDecoration: 'none' }}>
                  <Button variant='contained' onClick={this.handleLogIn}>{newAccount? 'Create New Account' : 'Log In'}</Button>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Button size='small' onClick={this.handleSwitch}>{newAccount? 'I already have an account' : 'Create New Account'}</Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </>
    );
  }
}

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
export default connector(Login);