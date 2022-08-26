import * as React from 'react';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material';
import { URL } from 'src/utils/url';

export const HoursListResults = ({ entries, entriesStatuses, ...rest }) => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [statuses, setStatuses] = useState(entriesStatuses);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChange = (event, index, entry) => {
    const newStatuses = [...statuses];
    newStatuses[index] = event.target.value;
    setStatuses(newStatuses);
    entry.hoursApprovalStatus = event.target.value;

    let month = entry.date.split(' ')[0].split('/')[1];
    let day = entry.date.split(' ')[0].split('/')[0];
    let year = entry.date.split(' ')[0].split('/')[2];
    let newDate = new Date(month + "/" + day + "/" + year);

    var data = {
      projectName: entry.projectName,
      employerID: entry.employerID,
      employeeID: entry.employeeID,
      date: newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate(),
      numberOfHours: entry.numberOfHours,
      hoursApprovalStatus: entry.hoursApprovalStatus
    };

    axios.put(URL + 'manageHours', data).then((response) => {
      alert("Entry updated successfully");
    });
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Employee's ID
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Hours
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.slice(page * limit, page * limit + limit).map((entry, index) => (
                <TableRow
                  hover
                  key={entry.projectName + entry.employerID + entry.employeeID + entry.date}
                >
                  <TableCell>
                    {entry.employeeID}
                  </TableCell>
                  <TableCell>
                    {entry.date.split(' ')[0]}
                  </TableCell>
                  <TableCell>
                    {entry.numberOfHours}
                  </TableCell>
                  <TableCell>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        name="hoursApprovalStatus"
                        onChange={event => handleChange(event, index + page * limit, entry)}
                        select
                        SelectProps={{ native: true }}
                        value={statuses[index + page * limit]}
                        variant="outlined"
                      >
                        <option
                          key="0"
                          value="0"
                        >
                          Pending approval
                        </option>
                        <option
                          key="1"
                          value="1"
                        >
                          Approved
                        </option>
                        <option
                          key="2"
                          value="2"
                        >
                          Rejected
                        </option>
                      </TextField>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={entries.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

HoursListResults.propTypes = {
  entries: PropTypes.array.isRequired
};
