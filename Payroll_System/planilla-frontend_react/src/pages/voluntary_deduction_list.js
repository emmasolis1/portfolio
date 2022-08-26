import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { SpecificVoluntaryDeductionEmployeeListResults } from '../components/specificVoluntaryDeductionEmployee/specific-voluntaryDeductionEmployee-list-results';
import { SpecificVoluntaryDeductionEmployeeListToolbar } from '../components/specificVoluntaryDeductionEmployee/specific-voluntaryDeductionEmployee-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class VoluntaryDeductionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voluntaryDeductions: [],
      APIUrl: URL + 'voluntaryDeductionsNotBeingUsedByEmployee'
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID") + "&employeeID=" + sessionStorage.getItem("employeeID")).then(response => {
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
            <SpecificVoluntaryDeductionEmployeeListToolbar />
            <Box sx={{ mt: 3 }}>
              {<SpecificVoluntaryDeductionEmployeeListResults voluntaryDeductions={this.state.voluntaryDeductions} />}
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

VoluntaryDeductionsList.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default VoluntaryDeductionsList;
