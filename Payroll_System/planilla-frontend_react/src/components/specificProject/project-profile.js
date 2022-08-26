import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { URL } from 'src/utils/url';

export const ProjectProfile = ({ project, ...props }) => {
  const router = useRouter();

  function viewEmployees() {
    router.push('/specific_project_employees');
  }

  function checkRegisteredHours() {
    router.push('/manage_hours');
  }

  function payProject() {
    axios.get(URL + 'payments?projectName=' + sessionStorage.getItem('project') + '&employerID=' + sessionStorage.getItem('employerID')).then(response => {
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
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            {project.projectName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Created by employer with ID: {project.employerID}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          display="inline"
          fullWidth
          sx={{ pl: 1 }}
          onClick={viewEmployees}
        >
          View Employees
        </Button>
      </CardActions>
      <CardActions>
        <Button
          color="primary"
          display="inline"
          fullWidth
          sx={{ pl: 1 }}
          onClick={checkRegisteredHours}
        >
          Check Registered Hours
        </Button>
      </CardActions>
      <CardActions>
        <Button
          color="error"
          display="inline"
          fullWidth
          sx={{ pl: 1 }}
          onClick={payProject}
        >
          Pay Project
        </Button>
      </CardActions>
    </Card>
  );
};
