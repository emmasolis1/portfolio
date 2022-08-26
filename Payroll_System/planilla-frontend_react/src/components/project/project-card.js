import PropTypes from 'prop-types';
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Clock as ClockIcon } from '../../icons/clock';
import { Download as DownloadIcon } from '../../icons/download';
import { getInitials } from '../../utils/get-initials';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { URL } from 'src/utils/url';

export const ProjectCard = ({ project, ...rest }) => {
  const router = useRouter();

  function editProject() {
    sessionStorage.setItem("project", project.projectName);
    router.push('/specificProject');
  };

  function viewEmployees() {
    sessionStorage.setItem("project", project.projectName);
    router.push('/specific_project_employees');
  }

  function payProject() {
    sessionStorage.setItem("project", project.projectName);
    axios.get(URL + 'payments?projectName=' + project.projectName + '&employerID=' + project.employerID).then(response => {
      if (response.data.length === 0) {
        alert('No more employees to pay today.');
      } else {
        let employeesPaid = "Payment completed successfully.\nEmployees Paid:\n\n";
        response.data.forEach(element => {
          employeesPaid.concat(element.employeeId);
          employeesPaid.concat('\n');
        });
        alert(employeesPaid);
        window.location.reload(false);
      }
    }).catch(error => {
      alert('No more employees to pay for today.');
    });
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Avatar>
            {getInitials(project.projectName)}
          </Avatar>
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {project.projectName}
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          {project.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: 'space-around' }}
        >
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
              onClick={editProject}
            >
              More info
            </Button>
            <Button
              color="primary"
              display="inline"
              sx={{ pl: 1 }}
              onClick={viewEmployees}
            >
              Employees
            </Button>
            <Button
              color="error"
              display="inline"
              sx={{ pl: 1 }}
              onClick={payProject}
            >
              Pay
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired
};
