import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { SpecificReportDetails } from '../components/specificReportEmployer/report-specific-information';
import { ReportEmployeeDetails } from '../components/account/account-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios';
import { URL } from 'src/utils/url';

class SpecificReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      report: [],
      isLoaded: false,
      APIUrl: URL + 'employerReport',
    };
  }

  componentDidMount() {
    var my_url = this.state.APIUrl + '?employerID=' + sessionStorage.getItem('employerID');
    my_url = my_url + '&projectName=' + sessionStorage.getItem('projectNameReportToVisualize') + '&paymentDate=' + sessionStorage.getItem('paymentDateReportToVisualize');

    // Get the data from the API
    axios.get(my_url).then(response => {
      this.setState({ isLoaded: true, report: response.data });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <>
          <Head>
            <title>
              Report | Ta' Bueno
            </title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8
            }}
          >
            <Container maxWidth="lg">
              <Typography
                sx={{ mb: 3 }}
                variant="h4"
              >
                Report
              </Typography>
              <Grid
                container
                spacing={3}
              >

                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <SpecificReportDetails report={this.state.report} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

SpecificReport.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpecificReport;
