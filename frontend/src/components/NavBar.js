import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';
import {StyledAppBar, StyledTypography, StyledButton1, StyledButton2, dropDownItems, dropDownMenu} from './Navbar.styles.js';
import globalContext from './globalContext';
import {useUserUpdate, useUser} from './providers/UserProvider.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Popover from '@mui/material/Popover';
import ListItemText from '@mui/material/ListItemText';
import LoginForm from './Login.js';
import SignupForm from './Signup.js';
import {useEffect} from 'react';


const pages = ['Browse Recipes', 'Meal Calendar', 'My Grocery List'];


const Header2 = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {loginStatus, setLoginStatus} = React.useContext(globalContext);

  const {setLoginOpen, setSignupOpen} = React.useContext(globalContext);

  const updateUser = useUserUpdate();
  const user = useUser();
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    loggedUser ? updateUser(loggedUser) : updateUser(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const handleClickLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleClickSignupOpen = () => {
    setSignupOpen(true);
  };

  const handleClickLogout = () => {
    localStorage.clear();
    updateUser(null);
    setLoginStatus(false);
    navigate('/');
    console.log('navigated');
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleGoTo = (event) => {
    handleCloseNavMenu();
    let text = event.target.innerText;
    console.log(text);
    if (text === 'Browse Recipes' || text === 'BROWSE RECIPES') {
      text = '';
    }
    const strLower = text.toLowerCase();
    console.log(strLower);
    const concat = strLower.replace(/\s/g, '');

    const page = '/' + concat;
    console.log(page);

    if (user === null && text !== '') {
      setLoginOpen(true);
    } else {
      navigate(page);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <>
    <LoginForm/>
    <SignupForm/>
    <StyledAppBar position="static" style={{backgroundColor: '#D24949', maxWidth: '100%'}}>
      <Container maxWidth='100%'>
        <Toolbar disableGutters>
          <StyledTypography
            variant="h6"
            noWrap
            component="div"
            style={{fontFamily: 'Copperplate, Papyrus, fantasy', fontSize: '30px', fontWeight: '500'}}
            sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}
          >
            Meal Prep
          </StyledTypography>

          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon style={{color: 'black'}} />
            </IconButton>
            <Popover
              open={Boolean(anchorElNav)}
              anchorEl={anchorElNav}
              onClose={handleCloseNavMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              sx={{...dropDownMenu}}>
              <List>
                {pages.map((page) => (

                  <ListItem
                  key={page}
                  onClick={handleGoTo}
                  component="div"
                  disablePadding
                  >
                    <ListItemButton>
                      <ListItemText
                      sx={{...dropDownItems}}
                      disableTypography
                      primary={page} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Popover>
          </Box>
          <StyledTypography
            variant="h6"
            noWrap
            component="div"
            style={{fontFamily: 'Copperplate, Papyrus, fantasy', fontSize: '18px', fontWeight: '500', marginRight: '8px'}}
            sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}
          >
            Meal Prep
          </StyledTypography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleGoTo}
                sx={{my: 2, color: 'white', display: 'block'}}
                style={{color: '#ffffff'}}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{flexGrow: 0, display: 'flex'}}>
            {
              user ?
                <>
                  <Typography variant='h5' style={{marginTop: 4}}>
                    {user.username ? user.username : user.email}
                  </Typography>
                  <StyledButton2 variant="contained" onClick={handleClickLogout} sx={{p: 0}}
                    style={{right: -14, backgroundColor: 'black'}}>
                    Logout
                  </StyledButton2>
                </> :
                <>
                  <StyledButton1 variant="contained" onClick={handleClickLoginOpen} sx={{p: 0}}
                    style={{right: -4, backgroundColor: 'black'}}>
                    Login
                  </StyledButton1>

                  <StyledButton2 variant="contained" onClick={handleClickSignupOpen} sx={{p: 0}}
                    style={{right: -14, backgroundColor: 'black'}}>
                    Signup
                  </StyledButton2>
                </>
            }
            <Menu
              sx={{mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
    </>


  );
};
export default Header2;
