import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { ReportListResults } from '../components/employeePaymentHistoryReport/report-list-results';
import { ReportListToolbar } from '../components/employeePaymentHistoryReport/report-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class EmployeePaymentHistoryReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      APIUrl: URL + 'employeePaymentHistory',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ reports: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Employee Payment History | Ta' Bueno
          </title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth={false}>
            <ReportListToolbar />
            <Box sx={{ mt: 3 }}>
              <ReportListResults reports={this.state.reports} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

EmployeePaymentHistoryReport.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default EmployeePaymentHistoryReport;
