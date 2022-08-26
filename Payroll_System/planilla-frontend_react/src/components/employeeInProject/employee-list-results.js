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

export const EmployeeListResults = ({ employees, ...rest }) => {
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

  const handleClickOpen = (id) => {
    sessionStorage.setItem("employeeID", id);
    setOpen(true);
  };

  const handleClose = (agreed) => {
    setOpen(false);
    if (agreed === true) {
      axios.delete(URL + "deleteEmployeeFromProject?projectName=" + sessionStorage.getItem("project") + "&id=" + sessionStorage.getItem("employeeID")).then(() => {
        alert("Employee deleted from project successfully");
        window.location.reload(false);
      });
    }
  };

  const seeContract = (employeeID, employeeFullName) => {
    sessionStorage.setItem("employeeID", employeeID);
    sessionStorage.setItem("employeeFullName", employeeFullName);
    router.push("specificContract");
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
                  Identification
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Location
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.slice(page * limit, page * limit + limit).map((employee) => (
                <TableRow
                  hover
                  key={employee.Identification}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={employee.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(employee.FullName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {employee.FullName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {employee.Identification}
                  </TableCell>
                  <TableCell>
                    {employee.Email}
                  </TableCell>
                  <TableCell>
                    {employee.Address}
                  </TableCell>
                  <TableCell>
                    {employee.Phone}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton aria-label="contract" color="primary" onClick={() => seeContract(employee.Identification, employee.FullName)}>
                        <ReadMoreIcon />
                      </IconButton>
                      <IconButton aria-label="delete" color="error" onClick={() => handleClickOpen(employee.Identification)}>
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
                            You are about to delete (fire) an employee from this project,
                            this implies ending their contract. Are you sure?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose} variant="outlined" color="primary">Cancel</Button>
                          <Button onClick={() => handleClose(true)} variant="contained" color="error">Fire Employee</Button>
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
        count={employees.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

EmployeeListResults.propTypes = {
  employees: PropTypes.array.isRequired
};
