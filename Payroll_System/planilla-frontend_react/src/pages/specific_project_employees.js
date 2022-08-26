import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { EmployeeListResults } from '../components/employeeInProject/employee-list-results';
import { EmployeeListToolbar } from '../components/employeeInProject/employee-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class SpecificProjectEmployees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      projectName: [],
      isLoaded: false,
      APIUrl: URL + 'specificProjectEmployees'
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(response => {
      this.setState({ isLoaded: true, employees: response.data });
    });
    this.setState({ projectName: sessionStorage.getItem("project") });
  }

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <>
          <Head>
            <title>
              {this.state.projectName}'s employees | Ta' Bueno
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
              <EmployeeListToolbar projectName={this.state.projectName} />
              <Box sx={{ mt: 3 }}>
                <EmployeeListResults employees={this.state.employees} />
              </Box>
            </Container>
          </Box>
        </>
      );
    }
  }
}

SpecificProjectEmployees.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default SpecificProjectEmployees;
