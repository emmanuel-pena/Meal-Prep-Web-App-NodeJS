import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import GroceryList from './GroceryList.js';
import GroceryList2 from './GroceryListTab.js';
import {MuiThemeProvider, createTheme} from '@material-ui/core/styles';
import {GlobalProvider} from './globalContext';
import AccountVerification from './AccountVerification.js';
import Header from './NavBar.js';
import MyCalendar from './Calendar.js';
import EmailForm from './EmailForm';
import Resetpassword from './Resetpassword.js';
import UserProvider from './providers/UserProvider';
import Home from './Home';
import {GoogleOAuthProvider} from '@react-oauth/google';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#D24949',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});


function App() {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [signupOpen, setSignupOpen] = React.useState(false);
  const [currentGroceryLists, setCurrentGroceryLists] = React.useState([]);
  const [loginStatus, setLoginStatus] = React.useState(false);
  const [currentGroceryListTabInfo, setCurrentGroceryListTabInfo] = React.useState([]);
  const [groceryListTabInfoFixed, setGroceryListTabInfoFixed] = React.useState([]);
  const [deletedAList, setDeletedAList] = React.useState(false);
  const [changedCalendar, setChangedCalendar] = React.useState(false);

  return (
    <GoogleOAuthProvider clientId='1054759242489-2s5rdkq3vh2dajfne2pnh8v2bp63bqfh.apps.googleusercontent.com'>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <UserProvider>
          <GlobalProvider value={{
            loginOpen, setLoginOpen,
            signupOpen, setSignupOpen,
            currentGroceryLists, setCurrentGroceryLists,
            loginStatus, setLoginStatus,
            currentGroceryListTabInfo, setCurrentGroceryListTabInfo,
            groceryListTabInfoFixed, setGroceryListTabInfoFixed,
            deletedAList, setDeletedAList,
            changedCalendar, setChangedCalendar,
          }}>
            <Routes>
              <Route path="/" element={

                <Home />
              }
              />

              <Route path="/verify" element={
                <AccountVerification />
              }
              />
              <Route path="/login/forgot_password" element={
                <EmailForm title={'Reset Account Password'} endpoint={'forgotPassword'} />
              }
              />
              <Route path="/resend" element={
                <EmailForm title={'Resend Verification Email'} endpoint={'resend_verification'} />
              }
              />
              <Route path="/resetpassword" element={
                <Resetpassword />
              }
              />
              <Route path="/browserecipes" element={
                <Resetpassword />
              }
              />
              <Route path="/mealcalendar" element={
                <div>
                  <Header />
                  <MyCalendar />
                </div>
              }
              />
              <Route path="/mygrocerylist" element={
                <>
                  <Header />
                  <GroceryList2 />
                </>
              }
              />
            </Routes>
          </GlobalProvider>
        </UserProvider>
      </BrowserRouter>
      </MuiThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
