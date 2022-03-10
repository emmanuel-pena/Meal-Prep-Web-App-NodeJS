/* eslint-disable max-len */
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {Typography, Box, Grid} from '@material-ui/core';
import {createTheme, makeStyles} from '@material-ui/core/styles';
import {Card, CardMedia, CardContent} from '@mui/material';
import RecipeView from './RecipeViewer/RecipeView';
import getRecipeInfo from '../recipeInfo';
import {ClassNames} from '@emotion/react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D24949',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  background: 'linear-gradient( #faf195 , #D24949)',
});
/*
Featured recipes grid component (child of home.js)
*/
function Featured() {
  // Initialize reactive recipe results to display from a state hook array to Featured cards [need to make a variable size, defaults to 'RENDERING']
  const [recipeResults, setRecipeResults] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerRecipe, setViewerRecipe] = useState(null);

  // Initialize display screen width to a reactive state hook
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Determine image & card sizes to render based on current screen width state
  // const imageUrl = windowWidth >= 650 ? desktopImage : mobileImage;
  const cardSize = windowWidth >= 650 ? 200 : 300;
  const textTheme = windowWidth >= 650 ? 'h6' : 'subtitle1';

  const openRecipeViewer = async (id) => {
    setViewerOpen(true);
    const recipeInfo = await getRecipeInfo(id);
    if (recipeInfo) {
      setViewerRecipe(recipeInfo);
    }
  };

  // Fetch and handle API Promise from Spoonacular, state change recipe card data with query results
  useEffect(() => {
    fetch('https://api.spoonacular.com/recipes/complexSearch?number=5&apiKey=2b14cdb3c6df4349be2a2bf80f70ae77')
      .then((response) => response.json())
      .then((data) => setRecipeResults(data.results));
    return () => {
      setRecipeResults([]);
    };
  }, []);

  // Return a grid of Featured Spoonacular recipe cards to render on the Home page (Home.js) [Will update to be a variable number of cards - Adam]
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      style={theme}
    >
      <>
      {recipeResults ?
      <Box sx={{display: 'flex'}}>
        <Grid item>
          <Grid
            container
            spacing={2}
            justifyContent="center"
          >
             {recipeResults.map((recipe) => {
              return (
                <Grid
                item xs={12}
                sm={'auto'}
                key={recipe.id}
                onClick={() =>openRecipeViewer(recipe.id)}
                style={{display: 'flex', justifyContent: 'center'}}>
                <Card sx={{'maxWidth': cardSize, '&:hover': {
            'boxShadow': '3px 3px 3px #d9d9d9',
            'cursor': 'pointer',
              }}}>
                  <CardMedia
                    component="img"
                    height={200}
                    image={recipe.image}
                    alt={recipe.title}
                  />
                  <CardContent style={{height: '80px'}}>
                    <Typography variant={textTheme} color="primary">
                      {recipe.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Box> :
      null }
      </>
      {viewerOpen ? <RecipeView isOpen={viewerOpen} setIsOpen={setViewerOpen} recipeProp={viewerRecipe}/> :
      null}
    </Grid>

  );
}
export default Featured;
