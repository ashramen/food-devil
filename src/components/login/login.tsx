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

interface LoginProps extends PropsFromRedux {};

interface LoginStates {
  username: string;
  password: string;
  confirmPassword: string;
  newAccount: boolean;
  correctLogIn: boolean;
  correctAccount: boolean;
};

class Login extends React.Component<LoginProps, LoginStates> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      newAccount: false,
      correctLogIn: true,
      correctAccount: true,
    };
  };

  validUserInfo = () => {
    return (this.state.username === 'username'
    && this.state.password === 'password');
  }

  correctLogInInfo = () => {
    // TODO: Implement this when backend is implemented
    return (this.state.username
      && this.state.password
      && this.validUserInfo()
    ) as boolean;
  }

  correctAccountInfo = () => {
    // Also implement unique username check
    return (this.state.username
      && this.state.password
      && this.state.confirmPassword
      && this.state.password === this.state.confirmPassword
    ) as boolean;
  }
  
  handleLogIn = () => {
    if (this.state.newAccount) {
      if (this.correctAccountInfo()) {
        // TODO: Create Account once backend is implemented
        this.setState({
          newAccount: false
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
      username,
      password,
      confirmPassword,
      newAccount,
      correctLogIn,
      correctAccount
    } = this.state;
    const errorMessage: string = (
      !(username && password && (!newAccount || confirmPassword))?
      'One of the required fields is empty.' : 
      newAccount && password !== confirmPassword?
      "Passwords don't match." :
      !this.validUserInfo()?
      'Incorrect username or password.' :
      'Username is already taken.'
    );
    return (
      <div>
        <h1 className='title'>Food Devil</h1>
        <h3 className='subtitle'>Please log in to access all features</h3>
        <Grid container
          spacing={2}
          direction='row'
          alignItems='center'
          justifyContent='center'
        >
          <Grid item xs={12}>
            <Grid container justifyContent='center'>
              {correctLogIn && correctAccount? <div></div> :
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
                  style ={{width: '35%'}}
                >
                  {errorMessage}
                </Alert>
              }
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label='Username'
              id='username'
              variant='standard'
              onChange={(e) => {this.setState({username: e.target.value})}}
              type='text'
              style ={{width: '35%'}}
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
              style ={{width: '35%'}}
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
              style ={{width: '35%'}}
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
      </div>
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