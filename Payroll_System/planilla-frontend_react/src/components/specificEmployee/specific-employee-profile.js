import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import * as React from 'react';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const SpecificEmployeeProfile = ({ user, ...props }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (agreed) => {
    setOpen(false);
    if (agreed === true) {
      fireEmmployee();
    }
  };

  function fireEmmployee() {
    // Call to backend to fire an employee.
    router.push('/employees');
  }

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            {user.FirstName + ' ' + user.LastName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            ID: {user.Identification}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {`
            ${user.State != '' && user.Country != '' && user.State != null && user.Country != null ? user.State + ', ' + user.Country : ''}
            ${user.State != '' && user.State != null && user.Country == '' || user.State != '' && user.State != null && user.Country == null ? user.State : ''}
            ${user.State == '' && user.Country != '' && user.Country != null || user.State == null && user.Country != '' && user.Country != null ? user.Country : ''}
            ${user.State == '' && user.Country == '' || user.State == '' && user.Country == null || user.State == null && user.Country == '' || user.State == null && user.Country == null ? 'No registered location' : ''}
            `}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="error"
          fullWidth
          variant="text"
          onClick={handleClickOpen}
        >
          Fire employee
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Alert: Please read!!!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You are about to delete (fire) an employee this means
              that you also will have to liquidate him. Are you sure?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">Cancel</Button>
            <Button onClick={() => handleClose(true)} variant="contained" color="error">Fire Employee</Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};
