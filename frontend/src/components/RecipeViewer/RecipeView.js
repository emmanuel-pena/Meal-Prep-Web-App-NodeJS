import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import RecipeViewTabs from './RecipeViewTabs';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import {useUser} from '../providers/UserProvider';
import {Typography} from '@mui/material';
import {StyledLongMenu} from '../GroceryList.styles';
import {StyledLongMenuCal} from '../Calendar.styles';
import {recipeImage, recipeViewerButtons} from './recipeView.style';

// global context
import globalContext from '../globalContext';


 const RecipeViewer = ({isOpen, setIsOpen, recipeProp}) => {
  const [open, setOpen] = useState(isOpen);
  const [recipe, setRecipe] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [favoritesResponse, setFavoritesResponse] = useState(null);

  const user = useUser();

  useEffect(() => {
    setRecipe(recipeProp);
    console.log(recipeProp);
  }, [recipeProp]);


   const addToFavorites = () => {
       try {
         const accessToken = user.accessToken;
         const body = {recipeId: recipe.id, RecipeObj: recipe};

         fetch('http://localhost:3010/favoriterecipe', {
           method: 'POST',
           body: JSON.stringify(body),
           headers: new Headers({
             'Authorization': 'Bearer ' + accessToken,
             'Content-Type': 'application/json',
           }),
         })
           .then((res) => {
             if (!res.ok) {
               setFavoritesResponse(res.status);
               throw res;
             }
             setFavoritesResponse(res.status);
             return res.json();
           })
           .catch((err) => {
             console.log(err);
           });
       } catch (e) {
         console.log(e);
       }
  };

  const favoritesMessage = (favRes) => {
    let message = '';
    let color ='green';

    if (favRes === 409) {
      message = 'Already added to Favorites';
      color = 'red';
    } else if (favRes === 200) {
      message = `Added ${recipe.title} to Favorites!`;
    } else {
      message = 'Error. Please try again...';
      color = 'red';
    }

    setTimeout(() =>{
      setFavoritesResponse(null);
    }, 3000);

    return (
      <Typography alignSelf={'center'} sx={{color: `${color}`}}>
        {message}
      </Typography>
    );
  };


  const handleClose = () => {
    setIsOpen(false);
    setOpen(false);
  };

  return (
    <>
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {recipe ?
        <><DialogTitle id="responsive-dialog-title" sx={{textAlign: 'center'}}>
                {recipe.title}
              </DialogTitle><DialogContent>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box
                      component="img"
                      sx={{...recipeImage}}
                      alt="recipe picture"
                      src={recipe.image} />
                  </Grid>
                  <RecipeViewTabs recipe={recipe} aria-labelledby='Recipe Tabs'/>
                </DialogContent>
                {favoritesResponse ? favoritesMessage(favoritesResponse) : null}
                <DialogActions>
                  <Button autoFocus onClick={handleClose} sx={{...recipeViewerButtons}}>
                    Close
                  </Button>
                <StyledLongMenu recipe={recipe}/>
                <StyledLongMenuCal recipe={recipe}/>
                  <Button
                    onClick={addToFavorites}
                    sx={{...recipeViewerButtons}}
                    autoFocus
                    disabled={user ? false : true}
                    >
                    Add to Favorite Recipes
                  </Button>
                </DialogActions></> :
      <CircularProgress/>}
      </Dialog>
    </div>

  </>


  );
};

export default RecipeViewer;
