import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TabPanel from './TabPanel';

const IngredientsList = ({ingredients, value}) => {
  const ingridentList = () => {
    return (
      <>
        {ingredients.map((ingr) => {
          return (
            <ListItem key={`${ingr.name} ${ingr.unit}`}>
              <ListItemText
                primary={ingr.name}
                secondary={`${ingr.amount} ${ingr.unit}`}
              >
              </ListItemText>
            </ListItem>
          );
        })}</>);
  };
  return (
    <TabPanel value={value} index={1}>
    <List dense={true}>
      {ingridentList()}
    </List>
    </TabPanel>
  );
};

export default IngredientsList;
