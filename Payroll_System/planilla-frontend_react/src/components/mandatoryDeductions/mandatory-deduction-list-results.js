import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
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
import { getInitials } from '../../utils/get-initials';

export const MandatoryDeductionListResults = ({ mandatoryDeductions, ...rest }) => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

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
                  Percentage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mandatoryDeductions.slice(page * limit, page * limit + limit).map(mandatoryDeduction => (
                <TableRow
                  hover
                  key={mandatoryDeduction.Name + mandatoryDeduction.Percentage + mandatoryDeduction.Description}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={mandatoryDeduction.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(mandatoryDeduction.Name)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {mandatoryDeduction.Name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {mandatoryDeduction.Description}
                  </TableCell>
                  <TableCell>
                    {mandatoryDeduction.Percentage + "%"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={mandatoryDeductions.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

MandatoryDeductionListResults.propTypes = {
  mandatoryDeductions: PropTypes.array.isRequired
};
