import React, {useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TabPanel from './TabPanel';
import IngredientsTab from './IngredientsTab';
import NutrientsTab from './NutrientsTab';
import Link from '@mui/material/Link';

const RecipeViewTabs = ({recipe}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderInstructions = (instructions) => {
    return (
      instructions.map((instruction, index) => {
        return (
          <ListItem key={index}>
          <ListItemText
              primary={`${index + 1}. ${instruction}`}
            >
            </ListItemText>
          </ListItem>
        );
      })
    );
  };

  return (
    <Box sx={{width: '100%', height: 300}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant={'fullWidth'}
          >
          <Tab label="Summary" />
          <Tab label="Ingredients" />
          <Tab label="Nutrients" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <List dense={true}>
        <ListItem >
              <ListItemText
                primary={'Serving Size'}
                secondary={recipe.servings}
              >
              </ListItemText>
            </ListItem>
            <ListItem>
            <ListItemText
                primary={'Total Time'}
                secondary={`${recipe.readyInMinutes} minutes`}
              >
              </ListItemText>
            </ListItem>
            <ListItem>
            <ListItemText
                primary={'Original source'}
                secondary={<Link href="#" underline="hover">
                {recipe.sourceUrl}
              </Link>}
              >
              </ListItemText>
            </ListItem>
            <ListItem>
            <ListItemText
                primary={'Instructions :'}
              >
              </ListItemText>
            </ListItem>
            {renderInstructions(recipe.instructions)}
        </List>
      </TabPanel>
      <IngredientsTab value={value} ingredients={recipe.ingredients} />
      <NutrientsTab value={value} nutrients={recipe.nutrients}/>
    </Box>
  );
};
export default RecipeViewTabs;
