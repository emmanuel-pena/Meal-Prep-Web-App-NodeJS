import {fireEvent, getByText, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountVerification from '../AccountVerification';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import userEvent from '@testing-library/user-event';

const URL = `http://localhost:3010/verify`;

const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    const token = req.body.token;
    if (token === 1) {
      return res(ctx.json({email: 'email@gmail.com'}));
    } else if (token === -1) {
      return res(ctx.status(403));
    } else {
      return res(ctx.status(409));
    }
  }),
);
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

test('Initial view of Page', async () => {
  jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(1);
  render(
    <AccountVerification />,
  );
  await waitFor(() => {
    screen.getAllByText('Meal Prep');
    screen.getAllByText('You will now be redirected to the homepage...');
});
});
describe('Testing Account verification responses', () =>{
  test('Successful account verification response', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(1);
    render(
      <AccountVerification />,
    );
    await waitFor(() => {
      screen.getAllByText('You\'re account has been verified. You can now now sign in with your new account.');
  });
});
  test('Invalid or exipired account verification response', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(-1);
    render(
      <AccountVerification />,
    );
    await waitFor(() => {
      screen.getAllByText('Oops! It looks like this link is invalid or expired. Please attempt to sign in and click the resend confirmation link');
  });
});
test('Already activated account verification response', async () => {
  jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(0);
  render(
    <AccountVerification />,
  );
  await waitFor(() => {
    screen.getAllByText('It looks like this account has already been verified. You can now sign in with your new account');
});
});
test('Redirected back to homepage after a few seconds', async () => {
  jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(1);
  render(
    <AccountVerification />,
  );
  setTimeout(() => {
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
}, 9000);
});
});
