import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import {StyledFilledInput} from './Signup.styles';
import {useNavigate} from 'react-router-dom';
import Alert from '@mui/material/Alert';
import globalContext from './globalContext';
import CircularProgress from '@mui/material/CircularProgress';

const SignupForm = () => {
  const {signupOpen, setSignupOpen} = React.useContext(globalContext);
  const [signUpMessage, setSignUpMessage] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  const [emailOk, setEmailOk] = React.useState(false);
  const [passwordsOk, setPasswordsOk] = React.useState(false);
  const [usernameOk, setUsernameOk] = React.useState(false);
  const [clickedSignup, setClickedSignup] = React.useState(false);

  const handleClose = () => {
    setSignupOpen(false);
    setSignUpMessage(null);
    setClickedSignup(false);
  };

  const handleCancel = () => {
    setValues({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
    });
    setEmailOk(false);
    setUsernameOk(false);
    setPasswordsOk(false);
    handleClose();
  };

  const createUser = () => {
    try {
      console.log('inside createUser)');

        setSignUpMessage('waiting');

        const param1 = values.username;
        const param2 = values.email;
        const param3 = values.password;

        const body = {username: param1, email: param2, password: param3};
        console.log(body);

      fetch('http://localhost:3010/user', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 409) {
            alert('User already exists');
          } else if (!res.ok && res.status !== 409) {
            alert('Server error');
            throw res;
          } else if (res.ok) {
            console.log('fetched post user');
            setSignUpMessage('Your account has been created. Please check your email for a verification link!');

            return;
          }
          })
          .catch((err) => {
            console.log(err);
          });
    } catch (e) {

    }
  };

  const creationResponse = (message) => {
    if (message === 'waiting') {
     return (
      <CircularProgress/>
     );
     }
    return (
    message.length > 0 ?
      <Alert severity= {`success`}>
        {message}
        </Alert> :
        null
    );
  };

  const handleSignUp = () => {
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const pwd = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    setClickedSignup(true);
    let eOk = false;
    let uOk = false;
    let pOk = false;

    if ((values.email).match(mailformat)) {
      eOk = true;
    }

    if ((values.username) !== '') {
      uOk = true;
    }

    if (values.password === values.confirmPassword &&
                  values.password.match(pwd)) {
        pOk = true;
    }

    if (values.email === '' || values.password === '' ||
      values.confirmPassword === '' || values.username === '') {
      alert('Fields cannot be empty');
    } else if (eOk === false | uOk === false || pOk === false) {
      setEmailOk(eOk);
      setPasswordsOk(pOk);
      setUsernameOk(uOk);
      alert('Please correct errors (marked red)');
    } else {
      setEmailOk(eOk);
      setPasswordsOk(pOk);
      setUsernameOk(uOk);
      createUser();
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setValues({...values, [prop]: event.target.value});
  };

  return (
    <div>
      <Dialog open={signupOpen} onClose={handleClose}>
        <DialogTitle style={{color: '#811010', backgroundColor: '#FFF2D4'}}>
          Welcome to the account sign up page</DialogTitle>
        <DialogContent style={{backgroundColor: '#FFF2D4'}}>
          <DialogContentText style={{color: '#3E76E9', backgroundColor: '#FFF2D4'}}>
            Please enter all fields:
          </DialogContentText>
          <div>&nbsp;</div>
          <InputLabel htmlFor="filled-adornment-password"
            style={{fontSize: 12, color: (usernameOk === false && clickedSignup === true)? 'red' : '#757575'}} >
            Username *</InputLabel>
          <StyledFilledInput
            required
            value={values.username}
            onChange={handleChange('username')}
            label="Username"
            placeholder="Username"
            style={{
              backgroundColor: 'white',
            }}
            fullWidth
            margin="dense"
          />
          <div>&nbsp;</div>
          <InputLabel htmlFor="filled-adornment-password"
           style={{fontSize: 12, color: (emailOk === false && clickedSignup === true)? 'red' : '#757575'}} >
            Email Address *</InputLabel>
          <StyledFilledInput
            required
            value={values.email}
            onChange={handleChange('email')}
            label="Email Address"
            placeholder="Email Address"
            style={{
              backgroundColor: 'white',
            }}
            fullWidth
            margin="dense"
          />
          <div>&nbsp;</div>
          <InputLabel htmlFor="filled-adornment-password"
           style={{fontSize: 12, color: (passwordsOk === false && clickedSignup === true)? 'red' : '#757575'}} >
            Password (length {'>'} 5 and contain a number) *</InputLabel>
          <StyledFilledInput
            id="filled-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            placeholder="Password"
            style={{
              backgroundColor: 'white',
            }}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <div>&nbsp;</div>
          <InputLabel htmlFor="filled-adornment-password"
            style={{fontSize: 12, color: (passwordsOk === false && clickedSignup === true)? 'red' : '#6F6F6F'}} >
            Confirm Password *</InputLabel>
          <StyledFilledInput
            id="filled-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Confirmed Password"
            style={{
              backgroundColor: 'white',
            }}
            fullWidth
          />
          <div>&nbsp;</div>
          {signUpMessage ? creationResponse(signUpMessage) : signUpMessage}
        </DialogContent>
        <DialogActions style={{backgroundColor: '#FFF2D4'}}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignupForm;
