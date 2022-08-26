import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { AccountProfile } from '../components/account/account-profile';
import { AccountProfileDetails } from '../components/account/account-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import axios from 'axios';
import { URL } from 'src/utils/url';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      isLoaded: false,
      APIUrl: URL + 'account',
    };
  }

  componentDidMount() {
    var data = { id: sessionStorage.getItem("userID") };
    axios.post(this.state.APIUrl, data).then(response => {
      this.setState({ isLoaded: true, user: (response.data)[0] });
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
              Account | Ta' Bueno
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
                Account
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
                  <AccountProfile user={this.state.user} />
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <AccountProfileDetails user={this.state.user} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
  }
}

Account.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Account;
