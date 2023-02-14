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
import {useUser} from './providers/UserProvider';
import {SnackbarProvider, useSnackbar} from 'notistack';

// global context
import globalContext from './globalContext';

const ITEM_HEIGHT = 48;

function LongMenuTemp(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [newList, setNewList] = React.useState('');
  const [changed, setChanged] = React.useState(false);
  const {currentGroceryLists, setCurrentGroceryLists} = React.useContext(globalContext);
  const {currentGroceryListTabInfo} = React.useContext(globalContext);
  const {deletedAList} = React.useContext(globalContext);

  const {enqueueSnackbar} = useSnackbar();

  const user = useUser();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setNewList(event.target.value);
    console.log(newList);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
    console.log(currentGroceryLists);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangedCurrrentGroceryList = () => {
    const temp = changed;
    setChanged(!temp);
  };

    const getCurrentGroceryLists = () => {
    try {
      const accessToken = user.accessToken;
      console.log('getting gl');
      fetch('http://localhost:3010/grocerylists', {
        headers: new Headers({
          'Authorization': 'Bearer ' + accessToken,
        }),
      })
        .then((results) => {
          if (!results.ok) {
            throw results;
          }
          return results.json();
        })
        .then((json) => {
          const temp = json;
          setCurrentGroceryLists(temp);
          console.log(json);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCurrentGroceryLists();
    console.log('getting grocery lists again');
  }, [deletedAList, changed, currentGroceryListTabInfo]);

  const pustToExistingGroceryList = (event) => {
    try {
      const accessToken = user.accessToken;

      const param1 = event.target.innerText;
      console.log(param1);
      const param2 = props.recipe.id;
      console.log(param2);
      const param3 = props.recipe;
      console.log(param3);

      const body = {listName: param1, recipeId: param2, RecipeObj: param3};
      console.log(body);

      fetch('http://localhost:3010/groceryrecipeexisting', {
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
          console.log('In final .then of pushToExistingList');
          enqueueSnackbar('Successfully added recipe to list!', 'success');
          handleChangedCurrrentGroceryList();
          console.log(json);
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

  const pushToNewGroceryList = () => {
    const prelimCheck = newList;

    if (prelimCheck === '') {
      handleClose();
      console.log('returning after doing nothing because the newGroceryListName was an empty string');
      return;
    }

    const accessToken = user.accessToken;

    try { // create the new grocery list and return an objet containing it's list id.
      const listNameToAdd = newList;
      console.log(listNameToAdd);
      const body = {listName: listNameToAdd};

      fetch('http://localhost:3010/grocerylists', {
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
          try { // insert recipe into the list with that list id
            const param1 = json.listId;
            console.log(param1);
            const param2 = props.recipe.id;
            const param3 = props.recipe;

            const body = {groceryListId: param1, recipeId: param2, RecipeObj: param3};
            console.log(body);

            fetch('http://localhost:3010/groceryrecipe', {
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
              .then((jsonn) => {
                console.log('In final .then pf pushToNewList');
                handleChangedCurrrentGroceryList();
                enqueueSnackbar('Successfully added recipe to list!', 'success');
                console.log(jsonn);
                const returned = jsonn;
                console.log(returned);
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (e) {
            console.log('console.loggin e');
            console.log(e);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log('console.loggin e');
      console.log(e);
    }

    setNewList('');
    handleClose();
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
          Add to Grocery List
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
          <Button style={{left: 2, width: '238px', textAlign: 'center'}} onClick={() => {
            handleClickOpenDialog();
          }} variant='contained' endIcon={<AddIcon />}>
            Add new Grocery List
       </Button>
          {currentGroceryLists ? currentGroceryLists.map((arrayObj) => (
            <>
              <MenuItem key={arrayObj.list_name} onClick={pustToExistingGroceryList} style={{
                'fontSize': '28px', '&:hover': {
                  'color': '#42a5f5',
                  'cursor': 'pointer',
                  'width': '240px',
                },
              }} >
                {arrayObj.list_name}
              </MenuItem>
              <div>
              </div>
            </>
          )): null}
        </Menu>
      </div>

      <div>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{color: '#811010'}}>Adding to a new grocery list</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add to a new grocery list, please enter the
              name of the new grocery list to create and add to.
          </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New Grocery List Name"
              type="email"
              fullWidth
              variant="standard"
              value={newList}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => {
              handleCloseDialog();
              pushToNewGroceryList();
            }}>Create Grocery List</Button>
          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
}

export default function LongMenu(props) {
  return (
    <SnackbarProvider maxSnack={1} style={{backgroundColor: 'green'}}>
      <LongMenuTemp recipe={props.recipe}/>
    </SnackbarProvider>
  );
}
