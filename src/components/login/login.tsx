import React from "react";
import { Link } from 'react-router-dom';

import Sidebar from '../sidebar/sidebar';

import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CloseIcon from '@mui/icons-material/Close';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../store/index';
import { logIn, logOut } from '../../store/actions';

import './styles.css';

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

  validUserName = () => {
    return this.state.username.match("^[A-Za-z0-9]+$");
  }

  validPassword = () => {
    const passwordLength: number =  this.state.password.length;
    return (passwordLength >= 8 && passwordLength <= 32);
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
      && this.validUserName()
      && this.validPassword()
    ) as boolean;
  }
  
  handleLogIn = () => {
    if (this.state.newAccount) {
      if (this.correctAccountInfo()) {
        // TODO: Create Account once backend is implemented
        this.setState({
          firstName: '',
          lastName: '',
          confirmPassword: '',
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

  closeMessage = () => {
      this.setState({
        correctLogIn: true,
        correctAccount: true,
        accountCreated: false,
      });
  }

  createTextField(label: string, id: string, onChange: any, password?: boolean) {
    const handleChange = (e: any) => {
      onChange(e);
      this.closeMessage();
    }
    return (
    <Grid item xs={12}>
      <TextField
        required
        label={label}
        id={id}
        variant='standard'
        onChange={handleChange}
        type={password? 'password': 'text'}
        style ={{width: '75%'}}
      />
    </Grid>)
  }

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
      !newAccount && !this.validUserInfo()?
      'Incorrect username or password.' :
      newAccount && !this.validUserName() ?
      'Username must only have letters and numbers.' :
      newAccount && !this.validPassword() ?
      'Password must be between 8 to 32 characters.' :
      'Username is already taken.'
    );
    return (
      <>
        <Sidebar page='login'/>
        <Grid container alignItems='center' direction="column">
          <Card sx={{
            maxWidth: 350,
            boxShadow: 5,
            marginTop: 20,
          }}>
            <h3>{newAccount? 'Create Account' : 'Log In'}</h3>
            {newAccount?
            <div className='subtitle'>Your username must only contain letters and numbers. <br></br>
            Your password must have between 8 to 32 characters.</div>
            : <div></div>}
            <Grid container
              spacing={1.5}
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
                          onClick={this.closeMessage}
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
                          onClick={this.closeMessage}
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
              <>{this.createTextField('First Name', 'first_name', (e: any) => {this.setState({firstName: e.target.value})})}
              {this.createTextField('Last Name', 'last_name', (e: any) => {this.setState({lastName: e.target.value})})}</>
              : <div></div>}
              {this.createTextField('Username', 'username', (e: any) => {this.setState({username: e.target.value})})}
              {this.createTextField('Password', 'password', (e: any) => {this.setState({password: e.target.value})}, true)}
              {newAccount? this.createTextField('Confirm Password', 'confirm_password', (e: any) => {this.setState({confirmPassword: e.target.value})}, true): <div></div>}
              <Grid item xs={12} mt={1}>
                <Link to={!newAccount && this.correctLogInInfo()? '/' : '/login'} style={{ textDecoration: 'none' }}>
                  <Button variant='contained' onClick={this.handleLogIn} sx={{
                    backgroundColor: '#003087'
                  }}>{newAccount? 'Create New Account' : 'Log In'}</Button>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Button size='small' onClick={this.handleSwitch} sx={{
                  color: '#003087'
                }}>{newAccount? 'I already have an account' : 'Create New Account'}</Button>
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