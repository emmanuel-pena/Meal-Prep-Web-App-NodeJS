import {fireEvent, getByText, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import FavoriteRecipes from '../FavoriteRecipes';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {UserContext} from '../providers/UserProvider';
import recipeResponse from '../../dev_data/format_recipe.json';

const URL = `http://localhost:3010/v0/favoriterecipe`;
const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    const token = req.headers._headers.authorization;
     if (token === 'Bearer 123') {
      return res(ctx.json([recipeResponse]));
     } else {
       return res(ctx.status(400));
     }
  }),
);


const mockUser = {
  id: '1',
  username: 'mock',
  accessToken: '123',
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


describe('Component Renders', () => {
  test('Successful Favorites request component render', async () => {
    render(
      <UserContext.Provider value={mockUser}>
        <FavoriteRecipes/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
      screen.getByText(recipeResponse.title);
      screen.getByAltText(recipeResponse.title);
    });
  });
  test('Favorites request with expired token', async () => {
    const expiredUser = {...mockUser, accessToken: '-1'};
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    render(
      <UserContext.Provider value={expiredUser}>
        <FavoriteRecipes/>
      </UserContext.Provider>,
    );
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Server error');
    });
    await waitFor(() => {
      const result = screen.queryByText(recipeResponse.title);
      expect(result).toBeNull();
    });
  });
});
