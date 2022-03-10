import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import recipe from '../../dev_data/sample_recipe.json';
import IngredientsTab from '../RecipeViewer/IngredientsTab';

describe('Ingredients are visible', () => {
  test('The name of each ingredient is visbile', async ()=> {
    render(<IngredientsTab value={1} ingredients={recipe.extendedIngredients}/>);
    for (const ingredient of recipe.extendedIngredients) {
      await screen.findByText(ingredient.name);
    }
  });
  test('The amount + unit of each ingredient is visbile', async ()=> {
    render(<IngredientsTab value={1} ingredients={recipe.extendedIngredients}/>);
    for (const ingredient of recipe.extendedIngredients) {
      let text = '';
      if (ingredient.unit) {
        text = `${ingredient.amount} ${ingredient.unit}`;
      } else {
        text = `${ingredient.amount}`;
      }
         screen.getAllByText(text);
    }
  });
});
