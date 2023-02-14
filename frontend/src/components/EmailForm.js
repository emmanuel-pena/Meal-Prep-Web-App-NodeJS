import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import {StyledFilledInput} from './Login.styles';
import {dialogContentStyle, dialogTitleStyle, emailFormStyle} from './EmailForm.styles';
import {useNavigate} from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const EmailForm = ({title, endpoint}) => {
  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [dimensions, setDimensions] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setDimensions(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const checkEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isValid = email.match(emailRegex);

    if (isValid) {
      setIsValidEmail(true);
      return true;
    }
    setIsValidEmail(false);
    return false;
  };
  const handleSubmit = () => {
    if (!checkEmail(email)) {
      return;
    }
    setIsSuccessful('wait');
    fetch(`http://localhost:3010/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify({email: email}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsSuccessful(true);
        } else {
          setIsSuccessful(false);
          throw res;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const submissionResult = (isSuccessful) => {
    let setSeverity = 'success';
    let message = '';

    if (isSuccessful === true) {
      message = 'Email has been sent!';
      setSeverity = 'success';
    }
    if (isSuccessful === false) {
      message = 'Invalid Email or Email is not connected to an account!';
      setSeverity = 'error';
    }
    if (isSuccessful === 'wait') {
      return (<CircularProgress sx={{mt: 1}} />);
    }

    return (
      message.length > 0 ?
      <Alert severity= {`${setSeverity}`}>
        {message}
        </Alert> :
        null
    );
  };

  return (

    <Dialog open={true}
      hideBackdrop={true}
      aria-label={`${title} Dialog`}
      fullScreen= {dimensions < 900 ? true : false} >
      <DialogTitle sx={{...dialogTitleStyle}}>
        Meal Prep
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{...dialogContentStyle}}>
          {title}
        </DialogContentText>
        <InputLabel
          htmlFor="filled-adornment-password"
          sx={{...emailFormStyle}}
          >
            Email *
          </InputLabel>
        <StyledFilledInput
          error={!isValidEmail}
          sx={{mt: 1}}
          required
          aria-label="Email Address"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          fullWidth
        />
        {submissionResult(isSuccessful)}
      </DialogContent>
      <DialogActions>
        <Button variant='contained'
          sx={{mb: 1}}
          size='large'
          onClick={() => navigate('/')}
          fullWidth = {true}
        >
          Cancel
        </Button>
        <Button
          sx={{mb: 1}}
          variant='contained'
          onClick={handleSubmit}
          size='large'
          fullWidth = {true}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailForm;
