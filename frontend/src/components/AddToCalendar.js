import * as React from 'react';
import {useEffect} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import {useUser} from './providers/UserProvider';

// global context
import globalContext from './globalContext';

const ITEM_HEIGHT = 48;

export default function LongMenuCal(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [newDate, setNewDate] = React.useState('');
  const [clickedMeal, setClickedMeal] = React.useState('');
  const [isSuccessful, setIsSuccessful] = React.useState(null);
  const {changedCalendar, setChangedCalendar} = React.useContext(globalContext);

  const user = useUser();

  const handleSubmit = (newDate) => {
    const isValidDate = (dateString) => new Date(dateString).toString() !== 'Invalid Date';

        if (isValidDate(newDate) === true) {
          setIsSuccessful(true);

          const meal = clickedMeal;
          handleCalendarAdd(meal, newDate);

          setClickedMeal('');
          setNewDate('');
          handleCloseDialog();
        } else {
          setIsSuccessful(false);
        }
  };

  const submissionResult = (isSuccessful) => {
    let setSeverity = 'success';
    let message = '';

    if (isSuccessful === true) {
      message = 'Added!';
      setSeverity = 'success';
    }
    if (isSuccessful === false) {
      message = 'Please specify a date in the following format: mm/dd/yyyy';
      setSeverity = 'error';
    }

      return (
        message.length > 0 ?
      <Alert severity= {`${setSeverity}`}>
        {message}
        </Alert> :
        null
      );
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setNewDate(event.target.value);
    console.log(newDate);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = (event) => {
    const meal = event.target.innerText;
    setClickedMeal(meal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setClickedMeal('');
    setNewDate('');
    setOpenDialog(false);
  };

  const handleChangedCalendar = () => {
    const temp = changedCalendar;
    setChangedCalendar(!temp);
  };

  const handleCalendarAdd = (title, date) => {
    try {
         const accessToken = user.accessToken;

         const param1 = title;
         const param2 = props.recipe.id;
         const param3 = props.recipe;
         const param4 = date;

        const body = {mealType: param1, recipeId: param2, RecipeObj: param3, date: param4};
        console.log(body);

      fetch('http://localhost:3010/calendarrecipe', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: new Headers({
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw res;
            }
            return res.json();
          })
          .then((json) => {
            handleChangedCalendar();
            console.log('In final .then of handleCalendarAdd');
            console.log(json);
          })
          .catch((err) => {
            console.log(err);
          });
    } catch (e) {
        console.log('console.loggin e');
        console.log(e);
    }
  };

  return (
    <div>
      <div>
        <Button aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          disabled={user ? false : true}
          onClick={handleClick} sx={{
            '&:hover': {
              'color': '#42a5f5',
              'cursor': 'pointer',
            },
          }}>
          Add to Calendar
                  </Button>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '32.5ch',
            },
          }}
        >
       <Button style={{left: 2, width: '238px', textAlign: 'center', textTransform: 'capitalize'}} onClick={handleClickOpenDialog} variant='contained' endIcon={<AddIcon />}>
            Breakfast
       </Button>
       <Button style={{left: 2, width: '238px', textAlign: 'center', textTransform: 'capitalize'}} onClick={handleClickOpenDialog} variant='contained' endIcon={<AddIcon />}>
            Lunch
       </Button>
       <Button style={{left: 2, width: '238px', textAlign: 'center', textTransform: 'capitalize'}} onClick={handleClickOpenDialog} variant='contained' endIcon={<AddIcon />}>
            Dinner
       </Button>
        </Menu>
      </div>

      <div>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{color: '#811010'}}>Adding to calendar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please specify the date in the following format: mm/dd/yyyy
          </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="mm/dd/yyyy"
              type="email"
              fullWidth
              variant="standard"
              value={newDate}
              onChange={handleChange}
            />
            {submissionResult(isSuccessful)}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => {
              handleSubmit(newDate);
            }}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
}
