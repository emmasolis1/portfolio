import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import { EmployeeListResults } from '../components/employee/employee-list-results';
import { EmployeeListToolbar } from '../components/employee/employee-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class Employees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      APIUrl: URL + 'employees',
    };
  }

  componentDidMount() {
    axios.get(this.state.APIUrl).then(response => {
      this.setState({ employees: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Employees | Ta' Bueno
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
            <EmployeeListToolbar />
            <Box sx={{ mt: 3 }}>
              <EmployeeListResults employees={this.state.employees} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}
Employees.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Employees;
