import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { URL } from 'src/utils/url';

export const ProjectProfileDetails = ({ project, ...props }) => {
  const formik = useFormik({
    initialValues: {
      budget: project.budget,
      paymentMethod: project.paymentMethod,
      description: project.description,
      maxNumberOfBenefits: project.maxNumberOfBenefits,
      maxBudgetForBenefits: project.maxBudgetForBenefits,
    }
  });

  const [payments, setPayments] = React.useState([]);

  useEffect(() => {
    let APIUrl = URL + 'employeePayments?projectName=' + sessionStorage.getItem('project') + '&userID=' + sessionStorage.getItem('userID');
    axios.get(APIUrl).then(response => {
      setPayments(response.data);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <form>
      <Card>
        <CardHeader
          title="Project's information:"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Budget"
                margin="none"
                value={formik.values.budget}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Payment Method"
                margin="none"
                value={formik.values.paymentMethod}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Max Number of Benefits"
                margin="none"
                value={formik.values.maxNumberOfBenefits}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Max Budget for Benefits"
                margin="none"
                value={formik.values.maxBudgetForBenefits}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Description"
                margin="none"
                value={formik.values.description}
                disabled={true}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>

      <Card>
        <CardHeader
          title="Payment history:"
        />
        <Divider />
        <CardContent>
          <PerfectScrollbar>
            <Box >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Gross Salary
                    </TableCell>
                    <TableCell>
                      Net Salary
                    </TableCell>
                    <TableCell>
                      Made by Employer
                    </TableCell>
                    <TableCell>
                      Contrat Type
                    </TableCell>
                    <TableCell>
                      Payment Date
                    </TableCell>
                    <TableCell>
                      Contract Start Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow
                      hover
                      key={payment.paymentDate}
                    >
                      <TableCell>
                        {"CRC" + payment.payment}
                      </TableCell>
                      <TableCell>
                        {"CRC" + payment.netSalary}
                      </TableCell>
                      <TableCell>
                        {payment.employerId}
                      </TableCell>
                      <TableCell>
                        {payment.contractType}
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate}
                      </TableCell>
                      <TableCell>
                        {payment.contractStartDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
        </CardContent>
      </Card>
    </form>
  );
};
