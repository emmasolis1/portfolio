import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { SpecificBenefitEmployeeListResults } from '../components/specificBenefitEmployee/specific-benefitEmployee-list-results';
import { SpecificBenefitEmployeeListToolbar } from '../components/specificBenefitEmployee/specific-benefitEmployee-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class BenefitsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      benefits: [],
      APIUrl: URL + 'benefitsNotBeingUsedByEmployee',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID") + "&employeeID=" + sessionStorage.getItem("employeeID")).then(response => {
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
            <SpecificBenefitEmployeeListToolbar />
            <Box sx={{ mt: 3 }}>
              <SpecificBenefitEmployeeListResults benefits={this.state.benefits} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

BenefitsList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default BenefitsList;
