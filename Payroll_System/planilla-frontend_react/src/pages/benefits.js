import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { BenefitListResults } from '../components/benefit/benefit-list-results';
import { BenefitListToolbar } from '../components/benefit/benefit-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class Benefits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      benefits: [],
      APIUrl: URL + 'benefits',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ benefits: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Benefits | Ta' Bueno
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
            <BenefitListToolbar />
            <Box sx={{ mt: 3 }}>
              <BenefitListResults benefits={this.state.benefits} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

Benefits.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Benefits;
