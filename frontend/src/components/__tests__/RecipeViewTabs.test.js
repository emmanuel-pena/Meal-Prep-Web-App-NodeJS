import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import recipes from '../../dev_data/format_recipe.json';
import RecipeViewTabs from '../RecipeViewer/RecipeViewTabs';


describe('Test initial Tab view', () => {
  test('check initial tabs are visible', () => {
    render(<RecipeViewTabs recipe={recipes}/>);
    screen.getByText('Summary');
    screen.getByText('Ingredients');
    screen.getByText('Nutrients');
  });
  test('Check Summary tab view is visible upon inital render', () => {
    render(<RecipeViewTabs recipe={recipes}/>);
    screen.getByText('Serving Size');
    screen.getByText(recipes.servings);
    screen.getByText('Total Time');
    screen.getByText(`${recipes.readyInMinutes} minutes`);
    screen.getByText('Original source');
    screen.getByText(recipes.sourceUrl);
  });
});
describe('Testing switching Tab view', () => {
  test('Check summary tab info is no longer visible after changing tabs', () => {
    render(<RecipeViewTabs recipe={recipes}/>);
    const ingrTab = screen.getByText('Ingredients');
    fireEvent.click(ingrTab);
    const summary = screen.queryByText('Serving Size');
    expect(summary).toBeNull();
  });
  test('Switch from summary to ingredients and then back to Summary', () => {
    render(<RecipeViewTabs recipe={recipes}/>);
    const ingrTab = screen.getByText('Ingredients');
    const summaryTab = screen.getByText('Summary');
    fireEvent.click(ingrTab);
    const summary = screen.queryByText('Serving Size');
    expect(summary).toBeNull();
    fireEvent.click(summaryTab);
    screen.getByText('Serving Size');
  });
  test('Switching to Ingredients tab and checking info is visible', () => {
    render(<RecipeViewTabs recipe={recipes}/>);
    const ingrTab = screen.getByText('Ingredients');
    fireEvent.click(ingrTab);
    for (const ingredient of recipes.ingredients) {
      let text = '';
      if (ingredient.unit) {
        text = `${ingredient.amount} ${ingredient.unit}`;
      } else {
        text = `${ingredient.amount}`;
      }
         screen.getAllByText(text);
    }
  });
  test('Switching to Nutrients tab and checking info is visible', async () => {
    render(<RecipeViewTabs recipe={recipes}/>);
    const ingrTab = screen.getByText('Nutrients');
    fireEvent.click(ingrTab);
    for (const nutrients of recipes.nutrients) {
      await screen.findByText(nutrients.name);
    }
  });
});
