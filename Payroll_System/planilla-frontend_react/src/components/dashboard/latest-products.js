import { subHours } from 'date-fns';
import { v4 as uuid } from 'uuid';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import axios from 'axios';
import { getInitials } from '../../utils/get-initials';
import { URL } from 'src/utils/url';

export const LatestProducts = ({ nextPayments, ...props }) => {
  function setDate(date_received) {
    if (date_received === '-1') {
      return 'You have never made a payment';
    } else {
      return `Next Payment on: ${date_received}`;
    }
  }

  function payProject(project) {
    sessionStorage.setItem("project", project.projectName);
    axios.get(URL + 'payments?projectName=' + project.projectName + '&employerID=' + sessionStorage.getItem('employerID')).then(response => {
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
      <CardHeader
        title="Next Payments"
      />
      <Divider />
      <List>
        {nextPayments.map((product, i) => (
          <ListItem
            divider={i < nextPayments.length - 1}
            key={product.projectName}
          >
            <ListItemAvatar>
              <Avatar>
                {getInitials(product.projectName)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={product.projectName}
              secondary={setDate(product.nextPayment)}
            />
            <Button
              color="primary"
              variant="text"
              onClick={() => payProject(product)}
            >
              Pay
            </Button>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
