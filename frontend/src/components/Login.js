import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import {TopDialogTitle, BottomDialogContentText, StyledFilledInput} from './Login.styles';
import {useUserUpdate} from './providers/UserProvider';
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

// global context
import globalContext from './globalContext';

const LoginForm = () => {
  const {loginOpen, setLoginOpen} = React.useContext(globalContext);
  const {loginStatus, setLoginStatus} = React.useContext(globalContext);
  const {loginUserr, setLoginUser} = React.useContext(globalContext);
  const [loginResponse, setLoginResponse] = React.useState();
  const navigate = useNavigate();
  const updateUser = useUserUpdate();

  const [clickedLogin, setClickedLogin] = React.useState(false);

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const handleClose = () => {
    setLoginResponse(null);
    setLoginOpen(false);
    setClickedLogin(false);
  };

  const handleCancel = () => {
    setValues({
      email: '',
      password: '',
      showPassword: false,
    });
    handleClose();
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

  const handleGoogleSuccess = (googleData) => {
    try {
      fetch('http://localhost:3010/google-login', {
        method: 'POST',
        body: JSON.stringify({
          name: googleData.name,
          email: googleData.email,
          picture: googleData.picture,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            alert('Server error');
            throw res;
          }
          return res.json();
        })
        .then((json) => {
          localStorage.setItem('user', JSON.stringify(json));
          console.log(json);
          updateUser(json);
          setLoginUser(JSON.parse(localStorage.getItem('user')));
          setLoginStatus(true);
          handleClose();
          // navigate('/signedin');  change page to wherever you want
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log('console.loggin e');
      console.log(e);
    }

    handleClose();
  };

  const loginUser = () => {
    try {
      setLoginResponse(null);
      console.log('inside loginUser)');
      console.log('Logging in user!');

      const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const param1 = values.email;
      const param2 = values.password;

      let body = {email: '', password: ''};

      if ((param1).match(emailValidator)) {
        body = {email: param1, password: param2};
        console.log(body);
      } else {
        body = {username: param1, password: param2};
        console.log(body);
      }

      fetch('http://localhost:3010/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              setLoginResponse('Invalid');
            }
            if (res.status === 403) {
              setLoginResponse('Unverified');
            }
            throw res;
          }
          return res.json();
        })
        .then((json) => {
          localStorage.setItem('user', JSON.stringify(json));
          updateUser(json);
          // setLoggedIn(true);
           navigate('/');
          handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log('console.loggin e');
      console.log(e);
    }
  };

  const handleLogin = () => {
    setClickedLogin(true);

    if (values.email === '' || values.password === '') {
      alert('Fields cannot be empty');
    } else {
      loginUser();
    }
  };

  const invalidLogin = (res) => {
    let message = '';
    let link = false;
    if (res === 'Invalid') {
      message = 'Invalid username/email or password';
      link = false;
    } else if (res === 'Unverified') {
      message = 'Your account has not been verified. Please click link below if you need the email resent.';
      link = true;
    } else {
      return null;
    }
    return (
      <>
        <DialogContent sx={{color: 'red'}}>
          {message}
        </DialogContent>
        {link ?
          <Button onClick={() => navigate('/resend')}>Resend Verification Email</Button> :
          null}
      </>
    );
  };

  return (
    <div>
      <Dialog open={loginOpen} onClose={handleClose}>
        <TopDialogTitle>
          Login with an existing account, or with Google
        </TopDialogTitle>
        <DialogContent style={{backgroundColor: '#FFF2D4'}}>
          <BottomDialogContentText>
            Login with an existing account:
            </BottomDialogContentText>
          <div>&nbsp;</div>
          <InputLabel htmlFor="filled-adornment-password"
            style={{fontSize: 12, color: (values.email === '' && clickedLogin === true) ? 'red' : '#757575'}} >
            Email or username *</InputLabel>
          <StyledFilledInput
            required
            value={values.email}
            onChange={handleChange('email')}
            label="Email Address"
            placeholder="Email or username"
            fullWidth
            margin="dense"
            style={{
              backgroundColor: 'white',
            }}
          />
          &nbsp;
          <InputLabel htmlFor="filled-adornment-password"
            style={{fontSize: 12, color: (values.password === '' && clickedLogin === true) ? 'red' : '#757575'}} >
            Password *</InputLabel>
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
            } />
          <div>&nbsp;</div>
          <GoogleLogin
            style={{width: 240}}
            onSuccess={(credentialResponse) => {
              handleGoogleSuccess(jwt_decode(credentialResponse.credential));
            }}

            onError={() => {
              alert('Login Failed!');
            }}
            />

          <div>&nbsp;</div>
          {invalidLogin(loginResponse)}
        </DialogContent>
        <DialogActions style={{backgroundColor: '#FFF3D0'}}>
          <Button onClick={() => navigate('/login/forgot_password')}>Forgot Password</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginForm;
