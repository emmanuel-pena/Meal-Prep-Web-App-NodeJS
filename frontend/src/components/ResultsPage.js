/* eslint-disable max-len */
import React from 'react';
import {useState} from 'react';
import {Typography, Box, Grid} from '@material-ui/core';
import {MuiThemeProvider, createTheme} from '@material-ui/core/styles';
import {Card, CardMedia, CardContent, CardActions} from '@mui/material';
import RecipeView from './RecipeViewer/RecipeView';
import getRecipeInfo from '../recipeInfo';


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
function ResultsPage({recipeResults, setSearched, favorites}) {
  console.log('???', recipeResults);
  // Initialize display screen width to a reactive state hook
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerRecipe, setViewerRecipe] = useState(null);


  // Determine image & card sizes to render based on current screen width state
  // const imageUrl = windowWidth >= 650 ? desktopImage : mobileImage;
  const cardSize = windowWidth >= 650 ? 250 : 150;
  const textTheme = windowWidth >= 650 ? 'h6' : 'subtitle1';

  const handleClick = async (recipe) => {
    setViewerOpen(true);
    if (!favorites) {
    const recipeInfo = await getRecipeInfo(recipe.id);
    if (recipeInfo) {
      setViewerRecipe(recipeInfo);
    }
    } else {
      setViewerRecipe(recipe);
    }
  };

  const renderRecipes = (recipeResults) => {
    return (
      <>
    {recipeResults.map((recipe) => {
      return (
        <Grid item xs="auto"
        key={recipe.id}
        onClick ={() => handleClick(recipe)}
        >
              <Card sx={{'maxWidth': cardSize, '&:hover': {
            'boxShadow': '3px 3px 3px #d9d9d9',
            'cursor': 'pointer',
              },
          }}>
                <CardMedia
                  component="img"
                  height= {cardSize}
                  image={recipe.image}
                  alt={recipe.title}/>
                <CardContent style={{height: '80px'}}>
                  <Typography variant={textTheme} color="primary">
                    {recipe.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
      );
    })}
    </>
    );
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      style={theme}
    >
      <Box display="flex" alignItems="center">
        <Grid item>
          <Grid
            container
            spacing={2}
            justifyContent="center">
            {renderRecipes(recipeResults)}

          </Grid>
        </Grid>
      </Box>
      {viewerOpen ? <RecipeView isOpen={viewerOpen} setIsOpen={setViewerOpen} recipeProp={viewerRecipe}/> :
      null}
    </Grid>

  );
}
export default ResultsPage;
