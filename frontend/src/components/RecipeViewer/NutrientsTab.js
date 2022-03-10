import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TabPanel from './TabPanel';


const NutrientsTab = ({nutrients, value}) => {
  const nutrientList = () => {
    return (
      <>
        {nutrients.map((nutr) => {
          return (
            <ListItem key={nutr.name}>
              <ListItemText
                primary={nutr.name}
                secondary={`${nutr.amount} ${nutr.unit}`}
              >
              </ListItemText>
            </ListItem>
          );
        })}</>);
  };

  return (
    <TabPanel value={value} index={2}>
    <List dense={true}>
      {nutrientList()}
    </List>
    </TabPanel>
  );
};

export default NutrientsTab;
