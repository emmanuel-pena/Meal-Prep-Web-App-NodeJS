import styled from 'styled-components';
import FilledInput from '@mui/material/FilledInput';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export const TopDialogTitle = styled(DialogTitle)`
color: #811010;
background-color: #FFF2D4;
@media screen and (max-width: 380px) {
font-size: 17px;
}

`;

export const BottomDialogContentText = styled(DialogContentText)`
color: #3E76E9;
background-color: #FFF2D4;
@media screen and (max-width: 380px) {
font-size: 14px;
}

`;

export const StyledFilledInput = styled(FilledInput)`

@media screen and (max-width: 380px) {
height: 43px;
}

`;

