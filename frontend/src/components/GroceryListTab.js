import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {StyledDiv, StyledDiv2, StyledDiv3} from './GroceryList.styles.js';
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from 'react';
import {useEffect} from 'react';
import {Grid} from '@material-ui/core';
import {MuiThemeProvider, createTheme} from '@material-ui/core/styles';
import {Card, CardMedia, CardContent, CardActions} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {useUser} from './providers/UserProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';


// global context
import globalContext from './globalContext';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
  'border': `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}} />}
    {...props}
  />
))(({theme}) => ({
  'backgroundColor':
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  'flexDirection': 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function GroceryList2() {
  const [expanded, setExpanded] = React.useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const textTheme = windowWidth >= 650 ? 'h6' : 'subtitle1';
  const {currentGroceryLists, setCurrentGroceryLists} = React.useContext(globalContext);
  const {currentGroceryListTabInfo, setCurrentGroceryListTabInfo} = React.useContext(globalContext);
  const {groceryListTabInfoFixed, setGroceryListTabInfoFixed} = React.useContext(globalContext);
  const {deletedAList, setDeletedAList} = React.useContext(globalContext);
  const [newList, setNewList] = React.useState('');
  const [addedBlankGroceryList, setAddedBlankGroceryList] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const deleteConfirmation = (key) => {
    const listToDelete = key;
    setToDelete(listToDelete);
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setToDelete(null);
    setOpenConfirmation(false);
  };

  const user = useUser();

  const handleChangeNewList = (event) => {
    setNewList(event.target.value);
    console.log(newList);
  };

  const getCurrentGroceryListTabInfo = async () => { // gets all grocery list tab info from data base
    console.log('In GroceryListTabInfo.js get grocery list tab info');

      try {
        console.log(user);
        if (user) {
          const accessToken = user.accessToken;
          console.log(accessToken);

          await fetch('http://localhost:3010/recipesandlistnames', {
            headers: new Headers({
              'Authorization': 'Bearer ' + accessToken,
            }),
          })
            .then((results) => {
              if (!results.ok) {
                throw results;
              }
              console.log(results);
              return results.json();
            })
            .then((json) => {
              const temp = json;
              setCurrentGroceryListTabInfo(temp);
              console.log(temp);
            });
        }
      } catch (e) {
        console.log(e);
      }
  };

  useEffect(() => {
    console.log('getting grocery lists tab info');
    getCurrentGroceryListTabInfo();
  }, [user, currentGroceryLists]);


  const handleFixGroceryTabInfoFormat = () => { // groups our info from the database by list names
    const result = currentGroceryListTabInfo.reduce(function(r, a) {
      r[a.listName] = r[a.listName] || [];
      r[a.listName].push(a);
      return r;
    }, Object.create(null));

    setGroceryListTabInfoFixed(result);
    console.log(groceryListTabInfoFixed);
  };

  useEffect(() => {
    handleFixGroceryTabInfoFormat();
  }, [currentGroceryListTabInfo, currentGroceryLists]);

  const handleDeletedACGroceryList = () => {
    const temp = deletedAList;
    setDeletedAList(!temp);
  };

  const handleClickGarbage = async (key) => {
    try {
      console.log('inside click garbage');
      const accessToken = user.accessToken;
      console.log(accessToken);
      const param = key;
      console.log(param);

      await fetch(`http://localhost:3010/grocerylists?listName=${param}`, {
        method: 'DELETE',
        headers: new Headers({
          'Authorization': 'Bearer ' + accessToken,
        }),
      });
      handleDeletedACGroceryList();
      getCurrentGroceryListTabInfo();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
    console.log(currentGroceryLists);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getCurrentGroceryLists = () => { // this is called after a new blank grocery list is created
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
  }, [addedBlankGroceryList]);

  const handleAddedBlankGroceryList = () => {
    const temp = addedBlankGroceryList;
    setAddedBlankGroceryList(!temp);
  };

  const createNewGroceryList = () => { // creates new blank grocery list
    const prelimCheck = newList;

    if (prelimCheck === '') {
      console.log('returning after doing nothing because the newGroceryListName was an empty string');
      return;
    }

    const accessToken = user.accessToken;

    try { // create the new grocery list
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
            const param2 = 0;
            const param3 = { // a blank recipe so that no ingredients get rendered
              'id': 0,
              'image': 'string',
              'servings': 0,
              'readyInMinutes': 0,
              'sourceUrl': 'string',
              'ingredients': [],
              'nutrients': [],
            };

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
                console.log('In final .then of createNewList');
                handleAddedBlankGroceryList();
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
          console.log('end of create new grocery list');
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log('console.loggin e');
      console.log(e);
    }

    setNewList('');
  };

  return (
    <div>
      {Object.keys(groceryListTabInfoFixed).map(function(key, index) {
        return (
          <Accordion expanded={expanded === key} onChange={handleChange(key)}>
            <StyledDiv>

              <StyledDiv2>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography>{key}</Typography>
                </AccordionSummary>
              </StyledDiv2>

              <StyledDiv3 variant="contained" onClick={() => {
                deleteConfirmation(key);
              }} style={{backgroundColor: '#F7918C'}}>
                <DeleteIcon style={{color: 'black'}} />
              </StyledDiv3>

            </StyledDiv>
            <AccordionDetails>
              {groceryListTabInfoFixed[key].map((obj) => {
                return (
              <div>
                {(obj.recipe.ingredients).map((line) => {
                return (
                  <Grid item xs="auto"
                  >
                    <Card sx={{
                      'maxWidth': 1000, '&:hover': {
                        'boxShadow': '3px 3px 3px #d9d9d9',
                        'cursor': 'pointer',
                      },
                    }}>
                      <CardContent>
                        <Typography variant={textTheme} color='#D24949' >
                          <Checkbox defaultUnchecked color="success" />
                          {line.name} - {line.amount} {line.unit}
                          <img src={'https://spoonacular.com/cdn/ingredients_100x100/' + line.image} alt={line.name} />
                    </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  );
                })}
                    </div>
                );
              })}

            </AccordionDetails>
          </Accordion>
        );
      })}

      <Button style={{position: 'fixed', bottom: 0, right: 0, height: '45px', width: '245px', textAlign: 'center'}} onClick={() => {
        handleClickOpenDialog();
      }} variant='contained' endIcon={<AddIcon />}>
        Add new Grocery List
    </Button>

      <div>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle style={{color: '#811010'}}>Creating a new grocery list</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To create a new grocery list, please enter the
              name of the new grocery list to create.
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
              onChange={handleChangeNewList}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => {
              handleCloseDialog();
              createNewGroceryList();
            }}>Create Grocery List</Button>
          </DialogActions>
        </Dialog>
      </div>

    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" style={{color: '#811010'}}>
          {'Are you sure you would like to delete this list?'}
        </DialogTitle>
          <DialogActions>
          <Button autoFocus onClick={handleCloseConfirmation}>
              Cancel
          </Button>
            <Button onClick={() => {
              handleClickGarbage(toDelete);
              handleCloseConfirmation();
            }} autoFocus>
              Delete
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}

