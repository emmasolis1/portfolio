import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { BenefitEmployeeListResults } from '../components/benefitEmployee/benefitEmployee-list-results';
import { BenefitEmployeeListToolbar } from '../components/benefitEmployee/benefitEmployee-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class BenefitsEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      benefits: [],
      APIUrl: URL + 'benefitsBeingUsedByEmployee',
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
            <BenefitEmployeeListToolbar />
            <Box sx={{ mt: 3 }}>
              <BenefitEmployeeListResults benefits={this.state.benefits} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

BenefitsEmployee.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default BenefitsEmployee;
