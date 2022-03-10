import {fireEvent, getByText, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailForm from '../EmailForm';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import userEvent from '@testing-library/user-event';

const URL = `http://localhost:3010/resend_verification`;
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    if (req.body.email === 'valid@gmail.com') {
      return res(ctx.json({email: 'valid@gmail.com'}));
    } else {
      return res(ctx.status(404));
    }
  },
));

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockedUsedNavigate.mockReset();
});
afterAll(() => server.close());

describe('Initial Render', () => {
  test('initial web view of EmailForm', async () => {
    render(
      <EmailForm title={'Resend Verification Email'} endpoint={'resend_verification'} />,
    );
    screen.getByText('Meal Prep');
    screen.getByText('Resend Verification Email');
    screen.getByText('Email *');
    screen.getByText('Cancel');
    screen.getByText('Confirm');
    const dialog = screen.getByLabelText('Resend Verification Email Dialog');
  });
});

describe('Test buttons', () => {
  test('Close button navigates user back to homepage', async () => {
    render(
      <EmailForm title={'Resend Verification Email'} endpoint={'resend_verification'} />,
    );
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });
  test('Testing email input shows what the user typed', async () => {
    render(
      <EmailForm title={'Resend Verification Email'} endpoint={'resend_verification'} />,
    );
    const emailInput = screen.getByDisplayValue('');
    userEvent.type(emailInput, 'valid@gmail.com');
    await waitFor(() => {
      expect(emailInput).toHaveValue('valid@gmail.com');
    });
  });
});

describe('Test submitting the resend verification request', () => {
  test('Valid resend verification request', async () => {
    render(
      <EmailForm title={'Resend Verification Email'} endpoint={'resend_verification'} />,
    );
    const emailInput = screen.getByDisplayValue('');
    const confirmButton = screen.getByText('Confirm');
    userEvent.type(emailInput, 'valid@gmail.com');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      screen.getByText('Email has been sent!');
    });
  });
  test('Invalid resend verification request', async () => {
    render(
      <EmailForm title={'Resend Verification Email'} endpoint={'resend_verification'} />,
    );
    const emailInput = screen.getByDisplayValue('');
    userEvent.type(emailInput, 'inValid@gmail.com');
    const confirmButton = screen.getByText('Confirm');
    userEvent.click(confirmButton);
    await waitFor(() => {
      screen.getByText('Invalid Email or Email is not connected to an account!');
    });
  });
  });

