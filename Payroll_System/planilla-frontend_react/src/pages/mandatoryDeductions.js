import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { MandatoryDeductionListResults } from '../components/mandatoryDeductions/mandatory-deduction-list-results';
import { MandatoryDeductionListToolbar } from '../components/mandatoryDeductions/mandatory-deduction-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class VoluntaryDeductions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mandatoryDeductions: [],
      APIUrl: URL + 'mandatoryDeductions',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl).then(response => {
      this.setState({ mandatoryDeductions: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Mandatory Deductions | Ta' Bueno
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
            <MandatoryDeductionListToolbar />
            <Box sx={{ mt: 3 }}>
              {<MandatoryDeductionListResults mandatoryDeductions={this.state.mandatoryDeductions} />}
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
