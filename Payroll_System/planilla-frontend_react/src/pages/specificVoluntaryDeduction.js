import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { SpecificVoluntaryDeductionProfile } from '../components/specificVoluntaryDeduction/specific-voluntaryDeduction-profile';
import { SpecificVoluntaryDeductionProfileDetails } from '../components/specificVoluntaryDeduction/specific-voluntaryDeduction-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios';
import { URL } from 'src/utils/url';

class SpecificVoluntaryDeduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voluntaryDeduction: [],
      isLoaded: false,
      APIUrl: URL + 'specificVoluntaryDeduction'
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?voluntaryDeductionName=" + sessionStorage.getItem("voluntaryDeduction") + "&projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ isLoaded: true, voluntaryDeduction: response.data });
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
              Voluntary Deduction Info | Ta' Bueno
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
                  <SpecificVoluntaryDeductionProfile voluntaryDeduction={this.state.voluntaryDeduction} />
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <SpecificVoluntaryDeductionProfileDetails voluntaryDeduction={this.state.voluntaryDeduction} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

SpecificVoluntaryDeduction.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpecificVoluntaryDeduction;
