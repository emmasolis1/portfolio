import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ProjectListToolbar } from '../components/projectEmployeeSide/project-list-toolbar';
import { ProjectCard } from '../components/projectEmployeeSide/project-card';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      APIUrl: URL + 'projectsEmployeeSide',
      limit: 6,
      page: 0,
    };
  }

  handleLimitChange(event) {
    this.state.limit = event.target.value;
    this.state.page = 0;
  }

  handlePageChange(event, newPage) {
    this.state.page = newPage;
  }

  componentDidMount() {
    axios.get(this.state.APIUrl + "?employeeID=" + sessionStorage.getItem("employeeID")).then(response => {
      this.setState({ projects: response.data });
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Projects | Ta' Bueno
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
            <ProjectListToolbar />
            <Box sx={{ pt: 3 }}>
              <Grid
                container
                spacing={3}
              >
                {this.state.projects.map((project) => (
                  <Grid
                    item
                    key={project.Item1.projectName + project.Item1.employerID}
                    lg={4}
                    md={6}
                    xs={12}
                  >
                    <ProjectCard project={project.Item1} contractType={project.Item2} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 3
              }}
            >
              <Pagination
                count={Math.ceil(this.state.projects.length / this.state.limit)}
                page={this.state.page}
                onChange={(event, newPage) => this.handlePageChange(event, newPage)}
                siblingCount={0}
                variant="text"
              />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
}

Projects.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Projects;
