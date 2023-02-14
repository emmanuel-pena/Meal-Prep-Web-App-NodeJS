/* eslint-disable max-len */
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {Typography, Box, Grid} from '@material-ui/core';
import {MuiThemeProvider, createTheme} from '@material-ui/core/styles';
import {Card, CardMedia, CardContent, CardActions} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import RecipeView from './RecipeViewer/RecipeView';
import {ThemeProvider} from '@mui/material/styles';
import BGPlain from '../img/plain-background.png';
import BGSTD from '../img/round-plates-sides.png';
import backgroundNarrow from '../img/round-plates.png';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import {useUser} from './providers/UserProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#32CD32',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  background: 'linear-gradient( #faf195 , #D24949)',
});

const themetest = createTheme({});// hacky empty theme to make the themeprovider happy cause the themeprovider makes the boxes happy
/* const theme = createTheme({
  typography: {
    allVariants: {
      color: "#32CD32"
    },
  },
});*/


// mui tabs https://mui.com/components/tabs/
function TabPanel(props) {
    const {children, value, index, ...other} = props;
    return (
      <div
        alignContent="center"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{p: 2}}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      'id': `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

/*
Featured recipes grid component (child of home.js)
*/
function GroceryList({recipeResults, setSearched}) {
  // Initialize display screen width to a reactive state hook
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [background, setBG] = useState(windowWidth >= 650 ? BGSTD : BGPlain);
  // Determine image & card sizes to render based on current screen width state
  // const imageUrl = windowWidth >= 650 ? desktopImage : mobileImage;
  const cardSize = windowWidth >= 650 ? 200 : 100;
  const textTheme = windowWidth >= 650 ? 'h6' : 'subtitle1';

  const [grocIngredients, setGrocIngredients] = useState([{'id': 0, 'extendedIngredients': [
          {
              'aisle': 'Milk, Eggs, Other Dairy',
              'amount': 1.0,
              'consitency': 'solid',
              'id': 1001,
              'image': 'butter-sliced.jpg',
              'measures': {
                  'metric': {
                      'amount': 1.0,
                      'unitLong': 'Tbsp',
                      'unitShort': 'Tbsp',
                  },
                  'us': {
                      'amount': 1.0,
                      'unitLong': 'Tbsp',
                      'unitShort': 'Tbsp',
                  },
              },
              'meta': [],
              'name': 'butter',
              'original': '1 tbsp butter',
              'originalName': 'butter',
              'unit': 'tbsp',
          },
      ]}]);

  // const [grocRecipes, setGrocRecipes] = useState(['715497', '644387', '638086']);
  // setGrocRecipes(['716342', '715594']);

  // fetch('http://localhost:3010/v0/groceryrecipe?groceryListID=123a986c-5a92-4004-9a8d-2d05b609dc81')
   // .then((response) => console.log(response));

  const grocRecipes = [];
  const grocArray = [];


  const user = useUser();
  const accessToken = user.accessToken;
  console.log(accessToken);


   // Fetch and handle API Promise from Spoonacular, state change grocery list recipe data with query results (Test that above works with fetched API Promise)
   /* grocRecipes.map((recipeID) => {

  }); */


    useEffect(() => {
      fetch('http://localhost:3010/groceryrecipe?groceryListID=123a986c-5a92-4004-9a8d-2d05b609dc81', {
        headers: new Headers({
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        }),
      })
      .then((response) => response.json())
        .then((data) => data.map((recobj) => {
          grocRecipes.push(recobj.id.toString());
        }))
      .then(() => console.log(grocRecipes))
      .then(() =>
      grocRecipes.map((recipeID) => {
        fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=5ae3ccf967fb408688f979b5cf40ecec`) // 715497 (Berry Smoothie recipe id from featured page)
          .then((response) => response.json())
          .then((data) => grocArray.push(data))
          .then(() => console.log(grocArray))
          .then(() => setGrocIngredients(grocArray));
      }));
      // setGrocIngredients(grocArray);
    }, []);


    // Planned design for logging multiple user recipes to the grocery list
      // Backend State Reader/Setter for grocery recipe ids (for current logged user)
      // Local database fetch to grab recipe ids + update state
      // Map return function for each recipe id in state:
        // API Fetch (or fetch to local db if possible) current recipe id
        // Update current 'checked recipe' state
        // Map return function below for each ingredient in recipe's 'ExtendedIngredients' field

        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
          setValue(newValue);
        };
          return (
            <>
            <div style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '120vh',
                color: '#f5f5f5'}}>
              <Grid style={{
                position: 'absolute', left: '50%', top: '15%',
                transform: 'translate(-50%, -50%)',
                  }}>
                  <ThemeProvider theme={themetest}>
                  <Box
                    sx={{
                      border: 1,
                      backgroundColor: '#D24949', // 'primary' but for some reason the Mui Box wasn't like that
                      boxShadow: 1,
                      borderRadius: 3,
                      borderColor: '#D24949',
                      marginBottom: 20,
                    }}
                  >
                </Box>
                </ThemeProvider>
              </Grid>
              <div style={{paddingTop: 90}}>
          return (
          <Box style={{content: 'center'}}>
            <Box style={{borderColor: 'divider', backgroundColor: '#D24949', marginLeft: '23.7%', width: '52.6%', alignItems: 'center', justifyContent: 'center'}}>
              <Tabs value={value} onChange={handleChange}>
                <Tab style={{fontSize: 30, color: '#ffffff', minWidth: '50%'}} label="Ingredients" {...a11yProps(0)} />
                <Tab style={{fontSize: 30, color: '#ffffff', minWidth: '50%'}} label="Recipe" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
            {grocIngredients.map((recipe) => {
              // console.log(recipe);
              return (
              recipe.extendedIngredients.map((ingredient) => {
                  return (
                        <Box
                        display="flex"
                        minWidth="1800"
                        minHeight="800"
                        flexdirection="row"
                        justifyContent={'center'}
                        >
                            <Grid item xs="auto" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)', maxWidth: 2000, minWidth: 1000, maxHeight: 800}} align="left"
                            >
                                <Card sx={{'maxWidth': 1800, '&:hover': {
                                    'boxShadow': '3px 3px 3px #d9d9d9',
                                    'cursor': 'pointer',
                                    },
                                }} style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}} align="center" justifyContent="center">
                                <CardContent style={{backgroundColor: 'rgba(255, 255, 255, 1)'}}>
                                <Typography variant={textTheme} color="primary" sx={{'text-decoration': 'line-through'}} align="center" justifyContent="center" >
                                    <Checkbox defaultUnchecked color="success" />
                                    {ingredient.name} - {ingredient.amount} {ingredient.unit}
                                    <img src={'https://spoonacular.com/cdn/ingredients_100x100/' + ingredient.image} alt={ingredient.name} />
                                </Typography>
                                </CardContent>
                            </Card>
                          </Grid>
                        </Box>
                  );
                }));
            })}
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
          </Box>
        );
          </div>
          </div>
          </>
        );
      }
//     return (
//       <>
//     <Typography variant="h2" color="primary" sx={{'text-decoration': 'line-through'}}>
//       Recipe 1 Grocery List:
//     </Typography>
//     {savedRecipes.extendedIngredients.map((ingredient) => {
//       return (
//         <Grid item xs="auto"
//         >
//               <Card sx={{'maxWidth': 1000, '&:hover': {
//             'boxShadow': '3px 3px 3px #d9d9d9',
//             'cursor': 'pointer',
//               },
//           }}>
//                 <CardContent>
//                   <Typography variant={textTheme} color="primary" sx={{'text-decoration': 'line-through'}}>
//                     <Checkbox defaultUnchecked color="success" />
//                     {ingredient.name} - {ingredient.amount} {ingredient.unit}
//                     <img src={'https://spoonacular.com/cdn/ingredients_100x100/' + ingredient.image} alt={ingredient.name} />
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//       );
//     })}
//     </>
//   );
// }
export default GroceryList;
