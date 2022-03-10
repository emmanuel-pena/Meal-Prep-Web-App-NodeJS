import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import NutrientsTab from '../RecipeViewer/NutrientsTab';
import {mockNutrients} from './MockData';

describe('Ingredients are visible', () => {
  test('The name of each ingredient is visbile', async ()=> {
    render(<NutrientsTab value={2} nutrients={mockNutrients}/>);
    for (const nutrients of mockNutrients) {
      await screen.findByText(nutrients.name);
    }
  });
  test('The amount + unit of each ingredient is visbile', async ()=> {
    render(<NutrientsTab value={2} nutrients={mockNutrients}/>);
    for (const nutrients of mockNutrients) {
        const text = `${nutrients.amount} ${nutrients.unit}`;
         screen.getAllByText(text);
    }
  });
});
