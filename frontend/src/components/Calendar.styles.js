import styled from 'styled-components';
import Button from '@mui/material/Button';
import LongMenuCal from './AddToCalendar.js';

export const StyledDiv= styled.div`

  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const StyledDiv2 = styled.div`
  position: static;
  width: 95%;
  @media screen and (max-width: 600px) {
  width: 85%;
 }
  &:hover {
    background-color: #D4D4D4;
  }
`;

export const StyledDiv3 = styled(Button)`
  position: static;
  cursor: auto;
  width: 5%;
  background-color: #EA6A6A;
  right: 0;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 600px) {
  width: 15%;
 }
`;
// roughly: sm, small: 600px. md, medium: 900px. lg, large: 1200px. xl, extra-large: 1536px.

export const StyledLongMenuCal = styled(LongMenuCal)`
 position: fixed;
 top: 0;
`;

