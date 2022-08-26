import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { SpecificVoluntaryDeductionEmployeeProfile } from '../components/specificVoluntaryDeductionEmployee/specific-voluntaryDeductionEmployee-profile';
import { SpecificVoluntaryDeductionEmployeeProfileDetails } from '../components/specificVoluntaryDeductionEmployee/specific-voluntaryDeductionEmployee-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios';
import { URL } from 'src/utils/url';

class SpecificVoluntaryDeductionEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voluntaryDeductionEmployee: [],
      isLoaded: false,
      APIUrl: URL + 'specificVoluntaryDeductionEmployee'
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?voluntaryDeductionName=" + sessionStorage.getItem("voluntaryDeduction") + "&projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ isLoaded: true, voluntaryDeductionEmployee: response.data });
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
              Voluntary Deduction | Ta' Bueno
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
                Voluntary Deduction
              </Typography>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <SpecificVoluntaryDeductionEmployeeProfile voluntaryDeduction={this.state.voluntaryDeductionEmployee} />
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <SpecificVoluntaryDeductionEmployeeProfileDetails voluntaryDeduction={this.state.voluntaryDeductionEmployee} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

SpecificVoluntaryDeductionEmployee.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpecificVoluntaryDeductionEmployee;
