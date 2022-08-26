import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getInitials } from '../../utils/get-initials';
import IconButton from '@mui/material/IconButton';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { URL } from 'src/utils/url';

export const VoluntaryDeductionListResults = ({ voluntaryDeductions, ...rest }) => {
  const router = useRouter();
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [open, setOpen] = React.useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = (voluntaryDeductionName) => {
    sessionStorage.setItem("voluntaryDeduction", voluntaryDeductionName);
    setOpen(true);
  };

  const handleClose = (agreed) => {
    setOpen(false);
    if (agreed === true) {
      axios.delete(URL + "deleteVoluntaryDeduction?voluntaryDeductionName=" + sessionStorage.getItem("voluntaryDeduction") + "&projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(() => {
        alert("Voluntary deduction deleted successfully");
        window.location.reload(false);
      });
    }
  };

  const viewVoluntaryDeduction = (voluntaryDeductionName) => {
    sessionStorage.setItem("voluntaryDeduction", voluntaryDeductionName);
    router.push('/specificVoluntaryDeduction');
  }

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Cost
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {voluntaryDeductions.slice(page * limit, page * limit + limit).map(voluntaryDeduction => (
                <TableRow
                  hover
                  key={voluntaryDeduction.voluntaryDeductionName + voluntaryDeduction.projectName + voluntaryDeduction.employerID}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={voluntaryDeduction.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(voluntaryDeduction.voluntaryDeductionName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {voluntaryDeduction.voluntaryDeductionName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {voluntaryDeduction.description}
                  </TableCell>
                  <TableCell>
                    {"CRC" + voluntaryDeduction.cost}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton aria-label="edit" color="primary" onClick={() => viewVoluntaryDeduction(voluntaryDeduction.voluntaryDeductionName)}>
                        <ReadMoreIcon />
                      </IconButton>
                      <IconButton aria-label="delete" color="error" onClick={() => handleClickOpen(voluntaryDeduction.voluntaryDeductionName)}>
                        <DeleteForeverIcon />
                      </IconButton>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Alert: Please read!!!"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            You are about to delete a voluntary deduction, this means
                            that everyone linked to it will lose access to it.
                            Are you sure?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose} variant="outlined" color="primary">Cancel</Button>
                          <Button onClick={() => handleClose(true)} variant="contained" color="error">Delete</Button>
                        </DialogActions>
                      </Dialog>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={voluntaryDeductions.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

VoluntaryDeductionListResults.propTypes = {
  voluntaryDeductions: PropTypes.array.isRequired
};
