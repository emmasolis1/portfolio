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

export const ReportListResults = ({ reports, ...rest }) => {
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

  const viewReport = (employer_id, project_name, payment_date) => {
    sessionStorage.setItem('projectNameReportToVisualize', project_name);
    sessionStorage.setItem('employerIDReportToVisualize', employer_id);
    sessionStorage.setItem('paymentDateReportToVisualize', payment_date);
    router.push('/specific_report_employer');
  }

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Project Name
                </TableCell>
                <TableCell>
                  Payment Date
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.slice(page * limit, page * limit + limit).map((report) => (
                <TableRow
                  hover
                  key={report.projectName + report.employerID + report.paymentDate}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={report.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(report.projectName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {report.projectName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {report.paymentDate.split(' ')[0]}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton aria-label="edit" color="primary" onClick={() => viewReport(report.employerID, report.projectName, report.paymentDate)}>
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
        count={reports.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ReportListResults.propTypes = {
  reports: PropTypes.array.isRequired
};
