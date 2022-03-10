import {fireEvent, getByText, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeView from '../RecipeViewer/RecipeView';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {UserContext} from '../providers/UserProvider';
import {act} from 'react-dom/test-utils';
import recipeResponse from '../../dev_data/format_recipe.json';

const URL = `http://localhost:3010/v0/favoriterecipe`;
const myMock = jest.fn();
const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    const {recipeId} = req.body;
    if (recipeId === 638308) {
      return res(ctx.json({
        memberId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        recipeId: 638308,
      }));
    } else if (recipeId === 100) {
      return res(ctx.status(409));
    } else {
      return res(ctx.status(400));
    }
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  myMock.mockReset();
});
afterAll(() => server.close());

describe('Component Renders', () => {
  test('Intiial compoennt render', async () => {
    render(
      <UserContext.Provider value={true}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
      screen.getByText(recipeResponse.title);
      screen.getByAltText('recipe picture');
    });
  });
  test('Intiial component does not render if not opened', async () => {
    render(
      <UserContext.Provider value={true}>
        <RecipeView isOpen={false} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
      const title = screen.queryByText(recipeResponse.title);
      expect(title).toBeNull();
    });
  });
  test('Check that recipe tab component was also rendered', async () => {
    render(
      <UserContext.Provider value={true}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
        screen.getByText('Summary');
    });
    await waitFor(() => {
      screen.getByText('Ingredients');
  });
  await waitFor(() => {
    screen.getByText('Nutrients');
});
  });
});
describe('Test dialog buttons', () => {
  test('Add to buttons are disabled when user is not logged in', async () => {
    render(
      <UserContext.Provider value={false}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
    expect(screen.getByText('Add to Favorite Recipes')).toHaveAttribute('disabled');
    });
  });
  test('Add to buttons are enabled when user logged in', async () => {
    render(
      <UserContext.Provider value={true}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
    expect(screen.getByText('Add to Favorite Recipes').disabled).toBe(false);
    });
  });
  test('Close button responds to click', async () => {
    render(
      <UserContext.Provider value={true}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
  const cancelButton = await waitFor(() =>screen.findByText('Close'));
  fireEvent.click(cancelButton);
  await waitFor(() => {
  expect(myMock.mock.calls.length).toBe(1);
  });
  });
  test('Successfull add to favorites', async () => {
    const user={accessToken: 'test'};
    render(
      <UserContext.Provider value={user}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeResponse}/>
      </UserContext.Provider>,
    );
    const favoriteButton = await waitFor(() =>screen.findByText('Add to Favorite Recipes'));
    fireEvent.click(favoriteButton);
    await waitFor(() => {
      screen.getByText(`Added ${recipeResponse.title} to Favorites!`);
    });
  });
  test('Adding recipe that is already in a users favorites', async () => {
    const myMock = jest.fn();
    const user={accessToken: 'test'};
    const recipeAlreadyAdded = {...recipeResponse};
    recipeAlreadyAdded.id = 100;
    render(
      <UserContext.Provider value={user}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={recipeAlreadyAdded}/>
      </UserContext.Provider>,
    );
    const favoriteButton = await waitFor(() =>screen.findByText('Add to Favorite Recipes'));
    fireEvent.click(favoriteButton);
    await waitFor(() => {
      screen.getByText('Already added to Favorites');
    });
  });
  test('Testing 400 response from server when clicking add to favorites', async () => {
    const myMock = jest.fn();
    const user={accessToken: 'test'};
    const incorrectRecipe = {...recipeResponse};
    incorrectRecipe.id = 0;
    render(
      <UserContext.Provider value={user}>
        <RecipeView isOpen={true} setIsOpen={myMock} recipeProp={incorrectRecipe}/>
      </UserContext.Provider>,
    );
    const favoriteButton = await waitFor(() =>screen.findByText('Add to Favorite Recipes'));
    fireEvent.click(favoriteButton);
    await waitFor(() => {
      screen.getByText('Error. Please try again...');
    });
  });
});
