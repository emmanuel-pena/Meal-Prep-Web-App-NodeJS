import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export const StyledAppBar = styled(AppBar)`

background-color: #D24949;

`;

// roughly: sm, small: 600px. md, medium: 900px. lg, large: 1200px. xl, extra-large: 1536px.

export const StyledTypography = styled(Typography)`

background-color: #D24949;
color: #ffffff;
text-align: left;
width: 27.5%;
`;

export const StyledButton1 = styled(Button)`

background-color: black;
text-transform: unset !important;
@media screen and (min-width: 300px) {
width: 82px;
height: 39px;
}

@media screen and (min-width:800px) {
  width: 120px;
  height: 45px;
  }

`;

export const StyledButton2 = styled(Button)`

background-color: black;
text-transform: unset !important;
@media screen and (min-width: 300px) {
width: 82px;
height: 39px;
}

@media screen and (min-width:800px) {
  width: 120px;
  height: 45px;
  }

`;

export const dropDownItems = {
  fontSize: {xs: 15,
    sm: 27},
};

export const dropDownList = {
  'ul.MuiList-root.MuiList-padding.css-h4y409-MuiList-root': {
  paddingTop: -5,
  paddingBottom: 0,
  },
};
export const dropDownMenu = {
  mt: {
    xs: 0.5,
    sm: 1,
  },
marginLeft: {
  xs: -2,
  sm: -3,
},
};
