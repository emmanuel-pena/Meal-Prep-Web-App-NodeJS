/* eslint-disable max-len */
import React, {useState, useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {useNavigate} from 'react-router-dom';

const AccountVerification = () => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const params = (new URL(document.location)).searchParams;
  const registrationToken = params.get('token');

  useEffect(() => {
    fetch('http://localhost:3010/verify', {
        method: 'POST',
        body: JSON.stringify({token: registrationToken}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log(res.status);
          if (res.status === 403 ) {
            setMessage('Oops! It looks like this link is invalid or expired. Please attempt to sign in and click the resend confirmation link');
            throw res;
          }
          if (res.status === 409) {
            setMessage('It looks like this account has already been verified. You can now sign in with your new account');
            throw res;
          }
          if (res.ok) {
            setMessage('You\'re account has been verified. You can now now sign in with your new account.');
            return;
          } else {
            throw res;
          }
        })
        .catch((e) => {
          console.log(e);
        });
        return () => {
          setMessage(null);
        };
  }, [registrationToken]);


  const redirectToHome = () => {
    setTimeout(() => {
      navigate('/');
}, 7000);
  };
  return (
    <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    sx={{height: '100%', width: '100%'}}
  >
    {message ?
    <>
    {redirectToHome()}
<Grid item xs="auto" >


<Card sx={{minWidth: 275, maxWidth: 700}}>

      <CardContent>

        <Typography variant="h4"
         color="text.primary" align='center' gutterBottom>
          Meal Prep
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
        {message}
        </Typography>
        <Typography variant="body2">
          You will now be redirected to the homepage...
        </Typography>
      </CardContent>
    </Card> </Grid>
    </> :
        <CircularProgress />
    }
    </Grid>

  );
};

export default AccountVerification;
