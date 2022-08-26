import * as React from 'react';
import axios from 'axios';
import { getInitials } from '../../utils/get-initials';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
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

export const SpecificVoluntaryDeductionEmployeeListResults = ({ voluntaryDeductions, ...rest }) => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const addVoluntaryDeduction = (voluntaryDeduction) => {
    var data = {
      voluntaryDeductionName: voluntaryDeduction.voluntaryDeductionName,
      projectName: voluntaryDeduction.projectName,
      employerID: voluntaryDeduction.employerID,
      employeeID: sessionStorage.getItem("employeeID"),
      description: voluntaryDeduction.description,
      cost: voluntaryDeduction.cost,
      startDate: "",
      endingDate: ""
    };
    axios.post(URL + 'requestVoluntaryDeduction', data)
      .then(function () {
        alert("Voluntary Deduction successfully established");
        window.location.reload(false);
      })
      .catch(function (error) {
        if (error.response) {
          alert("Error: Unknown error occurred");
        }
        window.location.reload(false);
      });
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
                  Value
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
                    <IconButton aria-label="add" color="primary" onClick={() => addVoluntaryDeduction(voluntaryDeduction)}>
                      <AddBoxIcon />
                    </IconButton>
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

SpecificVoluntaryDeductionEmployeeListResults.propTypes = {
  voluntaryDeductions: PropTypes.array.isRequired
};
