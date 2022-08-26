import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { HoursListResults } from '../components/manageHours/hours-list-results';
import { HoursListToolbar } from '../components/manageHours/hours-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class ManageHours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      entries: [],
      entriesStatuses: [],
      APIUrl: URL + 'getHours'
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ isLoaded: true, entries: response.data, entriesStatuses: response.data.map(el => el.hoursApprovalStatus) });
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
              Registered Hours | Ta' Bueno
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
              <HoursListToolbar />
              <Box sx={{ mt: 3 }}>
                <HoursListResults entries={this.state.entries} entriesStatuses={this.state.entriesStatuses} />
              </Box>
            </Container>
          </Box>
        </>
      );
    }
  }
}

ManageHours.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ManageHours;
