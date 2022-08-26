import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { VoluntaryDeductionListResults } from '../components/voluntaryDeduction/voluntaryDeduction-list-results';
import { VoluntaryDeductionListToolbar } from '../components/voluntaryDeduction/voluntaryDeduction-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class VoluntaryDeductions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voluntaryDeductions: [],
      APIUrl: URL + 'voluntaryDeductions',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ voluntaryDeductions: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Voluntary Deductions | Ta' Bueno
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
            <VoluntaryDeductionListToolbar />
            <Box sx={{ mt: 3 }}>
              {<VoluntaryDeductionListResults voluntaryDeductions={this.state.voluntaryDeductions} />}
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

VoluntaryDeductions.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default VoluntaryDeductions;
