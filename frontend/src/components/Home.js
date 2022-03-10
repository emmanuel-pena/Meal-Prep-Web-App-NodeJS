import React from 'react';
import {useState, useEffect} from 'react';
import BGPlain from '../img/plain-background.png';
import BGSTD from '../img/round-plates-sides.png';
import {Button, createTheme, Grid, Typography} from '@material-ui/core';
import {ThemeProvider} from '@mui/material';
import Featured from './Featured.js';
import ResultsPage from './ResultsPage.js';
import LoginForm from './Login.js';
import SearchBar from './SearchBar.js';
import Header from './NavBar.js';
import SignupForm from './Signup.js';
import {useUserUpdate, useUser} from './providers/UserProvider';
import FavoriteRecipes from './FavoriteRecipes';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {bgcolor, borderColor, Box} from '@mui/system';
import {StyledButton2} from './Navbar.styles';

const featuredTheme=createTheme({
  background: 'linear-gradient( #ffffff , #faf195)',
  paddingBottom: 25,
});
const themetest = createTheme({});

const Home = () => {
  const [view, setView] = useState('Featured');
  const updateUser = useUserUpdate();
  const user = useUser();


  useEffect(() => {
    if (!user && view === 'Favorites') {
      setView('Featured');
    }
  }, [user, view]);

  // Initialize display screen width to a reactive state hook
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [background, setBG] = useState(windowWidth >= 800 ? BGSTD : BGPlain);

  // Determines if search results exist to render (instead of home page) (back button switches back to home page)
  const [searched, setSearched] = useState(false);

  // Initialize reactive recipe results to display from a state hook array to Search Results cards [need to make a variable size, defaults to 'RENDERING']
  const [recipeResults, setRecipeResults] = useState(null);

  // Pass down parent state handler function to child components (i.e. for searchbar results)
  // Use this function whenever the 'Global' recipeResults should be changed from any component
  function handleResults(newResults) {
    setRecipeResults(newResults);
    console.log(newResults);
    setSearched(true);
    setView('Meal Results');
  }

  const showPage =(view) => {
      if (view === 'Featured') {
        return (
            <Featured />
        );
      }
      if (view === 'Meal Results') {
        return (
          <div>
                {recipeResults.length > 0 ?
          <ResultsPage recipeResults={recipeResults} setSearched={setSearched} favorites={false}/> :
          <Typography variant="h5" color="primary" align="center">
                No matching Results found
            </Typography>}
        </div>
        );
      }
      if (view === 'Favorites') {
        return (
        <FavoriteRecipes />
        );
      }
  };
  return (
    <>
    <div style={{height: '100%'}}>
    <Header/>
      <div className="App" style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '80%',
        width: '100%',
        color: '#f5f5f5',
      }}>

        <Grid container style={{paddingTop: 100,
        }}>
          <ThemeProvider theme={themetest}>
            <Grid item xs={12}>
              <Box
                sx={{
                  color: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  display: 'flex',
                }}
              >
                   <Typography
                   variant='h3'
                   color ='primary'
                   style={{marginLeft: windowWidth >600 ? 0 : 68,
                    inlineSize: windowWidth >600 ? 'auto' : 300}}>
                   Meal Prep Made Easy
                   </Typography>
              </Box>
              </Grid>
          </ThemeProvider>
          <br /><br />
          <Grid item xs={12} sx={{justifyContent: 'center'}}>
          <Box
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
          <SearchBar stateChanger={handleResults}>
          <StyledButton2 variant="contained"
             style={{marginLeft: 3, width: 'auto'}}
            color = 'primary'
            startIcon={<FavoriteIcon sx={{color: 'white'}}/>}
            onClick={() => setView('Favorites')}
            size='small'
            disabled= {!user}>
            <Typography variant='button' align="center">
              Favorites
            </Typography>
          </StyledButton2>
          </SearchBar>
          </Box>
          </Grid>

        </Grid>
      </div>

     <Typography variant="h3" color="primary" align="center" style={featuredTheme}>
       {view}
    </Typography>
      {showPage(view)}
    </div>
    </>
  );
};

export default Home;
