import Head from 'next/head';
import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { ContractProfile } from '../components/specificContract/contract-profile';
import { ContractProfileDetails } from '../components/specificContract/contract-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios';
import NextLink from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { URL } from 'src/utils/url';

class SpecificContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: [],
      employeeFullName: [],
      isLoaded: false,
      APIUrl: URL + 'specificContract',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID") + "&employeeID=" + sessionStorage.getItem("employeeID")).then(response => {
      this.setState({ isLoaded: true, contract: response.data });
    });
    this.setState({ employeeFullName: sessionStorage.getItem("employeeFullName") });
  }

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <>
          <Head>
            <title>
              Employee Contract | Ta' Bueno
            </title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8
            }}
          >
            <NextLink
              href="/specific_project_employees"
              passHref
            >
              <Button
                component="a"
                startIcon={<ArrowBackIcon fontSize="small" />}
              >
                Project's employees
              </Button>
            </NextLink>
            <Container maxWidth="lg">
              <Typography
                sx={{ mb: 3 }}
                variant="h4"
              >
                Employee Contract
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
                  <ContractProfile contract={this.state.contract} employeeFullName={this.state.employeeFullName} />
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <ContractProfileDetails contract={this.state.contract} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

SpecificContract.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpecificContract;
