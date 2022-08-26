import * as React from 'react';
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

export const VoluntaryDeductionEmployeeListResults = ({ voluntaryDeductions, ...rest }) => {
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

  const viewVoluntaryDeductionEmployee = (voluntaryDeductionName) => {
    sessionStorage.setItem("voluntaryDeduction", voluntaryDeductionName);
    router.push('/specificVoluntaryDeductionEmployee');
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
                  Start date
                </TableCell>
                <TableCell>
                  End date
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
                    {voluntaryDeduction.startDate}
                  </TableCell>
                  <TableCell>
                    {voluntaryDeduction.endingDate}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton aria-label="edit" color="primary" onClick={() => viewVoluntaryDeductionEmployee(voluntaryDeduction.voluntaryDeductionName)}>
                        <ReadMoreIcon />
                      </IconButton>
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

VoluntaryDeductionEmployeeListResults.propTypes = {
  voluntaryDeductions: PropTypes.array.isRequired
};
