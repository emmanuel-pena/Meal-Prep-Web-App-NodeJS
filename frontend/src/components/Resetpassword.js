import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import {StyledFilledInput} from './Login.styles';
import {dialogContentStyle, dialogTitleStyle} from './EmailForm.styles';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {inputLabel} from './resetpassword.style.js';

const Resetpassword = () => {
  const [dimensions, setDimensions] = useState(window.innerWidth);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [matching, setMatching] = useState(true);
  const [responseCode, setResponseCode] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const resetToken =searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() =>{
    const handleResize = () => {
      setDimensions(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);

const handleSubmit = () => {
  if (password !== passwordConfirm) {
    setMatching(false);
    setPassword('');
    setPasswordConfirm('');
    return;
  }
  fetch(`http://localhost:3010/resetPassword`, {
    method: 'POST',
    body: JSON.stringify({password: password, token: resetToken}),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      console.log(res.status);
      if (res.ok) {
        return res.json();
      } else {
        setResponseCode(403);
        throw res;
      }
    })
    .then((json) => {
      console.log(json);
      setResponseCode(200);
    })
    .catch((e) => {
      console.log(e);
    });
};

const displayMatchingError = (matching) => {
  if (!matching) {
  return (
    <DialogContent sx={{color: 'red'}}>
      Passwords must match! Please enter the new password again.
    </DialogContent>
  );
  } else {
    return null;
  };
};

const displayResponse = (responseCode) => {
  let color ='green';
  let message = 'You have successfully set your new password!';
  if (responseCode === 403) {
    message = 'Invalid or expired link. Please go back to the homepage and click forgot password.';
    color = 'red';
  }
  return (
    <>
    <DialogTitle sx={{color: color}}>
      {message}
    </DialogTitle>
    <DialogActions sx={{justifyContent: 'center'}}>
       <Button variant='contained'
    sx={{mb: 1}}
    size = 'medium'
    onClick = {() => navigate('/')}
     >Return home</Button>
    </DialogActions>
    </>
  );
};

const handlePasswordChange = (e) => {
  setPassword(e.target.value);
};
const handlePasswordConfirmChange = (e) => {
  setPasswordConfirm(e.target.value);
};

  return (

<Dialog open ={true} hideBackdrop={true}
        fullScreen = {dimensions < 900 ? true : false} >
          {responseCode ?
          displayResponse(responseCode) :
          <>
        <DialogTitle sx={{...dialogTitleStyle}}>
          Meal Prep
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{...dialogContentStyle}}>
            Set New Password
          </DialogContentText>
          <InputLabel htmlFor="filled-adornment-password"
           // eslint-disable-next-line max-len
           sx={{...inputLabel}}>
            New Password *</InputLabel>
          <StyledFilledInput
          sx={{mt: 1}}
           type='password'
            required
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            fullWidth
          />
           <InputLabel htmlFor="filled-adornment-password"
           // eslint-disable-next-line max-len
           sx={{...inputLabel}}>
            Confirm Password *</InputLabel>
          <StyledFilledInput
          sx={{mt: 1}}
           type='password'
            required
            label="Confirm password"
            placeholder="Password"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            fullWidth

          />
          {displayMatchingError(matching)}
        </DialogContent>
        <DialogActions>
          <Button variant='contained'
          sx={{mb: 1}}
          size = 'large'
          fullWidth= {true}
          onClick = {() => navigate('/')}
           >Cancel</Button>
          <Button
          sx={{mb: 1}}
          variant='contained'
          size = 'large'
          fullWidth= {true}
          onClick={handleSubmit}
          >Confirm</Button>
        </DialogActions>
        </>
}
      </Dialog>
  );
};

export default Resetpassword;
