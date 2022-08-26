import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ProjectProfile } from '../components/specificProject/project-profile';
import { ProjectProfileDetails } from '../components/specificProject/project-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios';
import { URL } from 'src/utils/url';

class SpecificProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      isLoaded: false,
      APIUrl: URL + 'specificProject'
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?project=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ isLoaded: true, project: response.data });
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
              Project | Ta' Bueno
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
                Project
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
                  <ProjectProfile project={this.state.project} />
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <ProjectProfileDetails project={this.state.project} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

SpecificProject.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpecificProject;
