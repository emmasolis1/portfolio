import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboardEmployee/budget';
import { TotalProfit } from '../components/dashboardEmployee/total-profit';
import { TrafficByDevice } from '../components/dashboardEmployee/traffic-by-device';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class DashboardEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      info: [],
      APIUrl: URL + 'dashboardEmployee',
    };
  }

  componentDidMount() {
    let requestAPI = this.state.APIUrl + "?employeeID=" + sessionStorage.getItem("employeeID");
    axios.get(requestAPI).then(response => {
      this.setState({ isLoaded: true, info: response.data });
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
              Dashboard | Ta' Bueno
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
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xl={6}
                  lg={6}
                  sm={6}
                  xs={12}
                >
                  <Budget totalProjects={this.state.info.totalWorkingProjects} />
                </Grid>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  sm={6}
                  xs={12}
                >
                  <TotalProfit totalProjectsCost={this.state.info.totalProjectsIncome} sx={{ height: '100%' }} />
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  xl={3}
                  xs={12}
                >
                  <TrafficByDevice projects={this.state.info.totalProjectsIncome} sx={{ height: '100%' }} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

DashboardEmployee.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default DashboardEmployee;
