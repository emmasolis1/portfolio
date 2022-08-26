import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { ReportListResults } from '../components/report/report-list-result';
import { ReportsToolbar } from '../components/report/report-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      APIUrl: URL + 'reports',
    };
  }

  componentDidMount() {
    var my_url = this.state.APIUrl + '?employeeID=' + sessionStorage.getItem('userID');
    axios.get(my_url).then(response => {
      this.setState({ reports: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Reports | Ta' Bueno
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
            <ReportsToolbar />
            <Box sx={{ mt: 3 }}>
              <ReportListResults reports={this.state.reports} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}
Reports.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Reports;
