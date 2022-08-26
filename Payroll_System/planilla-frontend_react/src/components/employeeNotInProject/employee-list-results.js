import * as React from 'react';
import { getInitials } from '../../utils/get-initials';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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

export const EmployeeListResults = ({ employees, ...rest }) => {
  const router = useRouter();
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const addEmployeeToProject = (employee) => {
    sessionStorage.setItem("employeeID", employee.Identification);
    router.push('/insert_contract');
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
                    <IconButton aria-label="add" color="primary" onClick={() => addEmployeeToProject(employee)}>
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
