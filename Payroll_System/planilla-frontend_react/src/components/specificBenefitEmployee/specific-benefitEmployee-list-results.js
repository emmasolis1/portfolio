import * as React from 'react';
import axios from 'axios';
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
import { URL } from 'src/utils/url';

export const SpecificBenefitEmployeeListResults = ({ benefits, ...rest }) => {
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

  const addBenefit = (benefit) => {
    var data = {
      benefitName: benefit.benefitName,
      projectName: benefit.projectName,
      employerID: benefit.employerID,
      employeeID: sessionStorage.getItem("employeeID"),
      description: benefit.description,
      cost: benefit.cost,
      startDate: "",
      endDate: ""
    };
    axios.post(URL + 'requestBenefit', data)
      .then(function () {
        alert("Benefit successfully established, returning to main benefits page");
        router.push("benefitsEmployee");
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
              {benefits.slice(page * limit, page * limit + limit).map(benefit => (
                <TableRow
                  hover
                  key={benefit.benefitName + benefit.projectName + benefit.employerID}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={benefit.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(benefit.benefitName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {benefit.benefitName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {benefit.description}
                  </TableCell>
                  <TableCell>
                    {"CRC" + benefit.cost}
                  </TableCell>
                  <TableCell>
                    <IconButton aria-label="add" color="primary" onClick={() => addBenefit(benefit)}>
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
        count={benefits.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

SpecificBenefitEmployeeListResults.propTypes = {
  benefits: PropTypes.array.isRequired
};
