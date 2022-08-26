import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { URL } from 'src/utils/url';

const InsertContract = () => {
  const [project, setProject] = useState('');
  const [employerID, setEmployerID] = useState('');
  const [employeeID, setEmployeeID] = useState('');

  useEffect(() => {
    setProject(sessionStorage.getItem('project'));
  }, [project]);

  useEffect(() => {
    setEmployerID(sessionStorage.getItem('employerID'));
  }, [employerID]);

  useEffect(() => {
    setEmployeeID(sessionStorage.getItem('employeeID'));
  }, [employeeID]);

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      projectName: project,
      employerID: employerID,
      employeeID: employeeID,
      startDate: new Date(new Date().getTime() + new Date().getTimezoneOffset() * -60000),
      expectedEndingDate: new Date(new Date().getTime() + new Date().getTimezoneOffset() * -60000),
      realEndedDate: '',
      position: '',
      schedule: '',
      netSalary: '',
      contractType: '0'
    },
    validationSchema: Yup.object({
      position: Yup
        .string()
        .max(128)
        .required(
          'Position is required'),
      schedule: Yup
        .string()
        .max(255)
        .required(
          'Schedule is required'),
      netSalary: Yup
        .string()
        .required(
          'Net salary is required')
    }),
    onSubmit: values => {
      var data = {
        projectName: sessionStorage.getItem("project"),
        employerID: sessionStorage.getItem("employerID"),
        employeeID: sessionStorage.getItem("employeeID"),
        startDate: values.startDate,
        expectedEndingDate: values.expectedEndingDate,
        realEndedDate: '',
        position: values.position,
        schedule: values.schedule,
        netSalary: values.netSalary,
        contractType: values.contractType
      };
      axios.post(URL + 'addEmployeeToProject', data)
        .then(function () {
          alert("Contract successfully saved, returning to project's employee list");
          router.push('/specific_project_employees');
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response)
            // The client was given an error response (5xx, 4xx)
            alert("Error: Contract may already exist, returning to project's employee list");
          } else {
            alert("Error: Unknown error occurred, returning to project's employee list");
          }
          router.push('/specific_project_employees');
        });
    }
  });

  return (
    <>
      <Head>
        <title>
          Insert Contract | Ta' Bueno
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/add_employee_to_project"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Return to employee list
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Insert the information of a contract
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
              </Typography>
            </Box>
            <Box sx={{ my: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    label="Start Date"
                    value={formik.values.startDate}
                    onChange={(value) => {
                      formik.setFieldValue('startDate', value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label="Ending Date"
                    value={formik.values.expectedEndingDate}
                    minDate={new Date(formik.values.startDate)}
                    onChange={(value) => {
                      formik.setFieldValue('expectedEndingDate', value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>
            <TextField
              error={Boolean(formik.touched.position && formik.errors.position)}
              fullWidth
              helperText={formik.touched.position && formik.errors.position}
              label="Position"
              margin="normal"
              name="position"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.position}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.schedule && formik.errors.schedule)}
              fullWidth
              helperText={formik.touched.schedule && formik.errors.schedule}
              label="Schedule"
              margin="normal"
              name="schedule"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.schedule}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.netSalary && formik.errors.netSalary)}
              fullWidth
              helperText={formik.touched.netSalary && formik.errors.netSalary}
              label="Net Salary"
              margin="normal"
              name="netSalary"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.netSalary}
              variant="outlined"
            />
            <Box>
              <TextField
                fullWidth
                label="Contract Type"
                margin="normal"
                name="contractType"
                onChange={formik.handleChange}
                select
                SelectProps={{ native: true }}
                value={formik.values.contractType}
                variant="outlined"
              >
                <option
                  key="0"
                  value="0"
                >
                  Full-time
                </option>
                <option
                  key="1"
                  value="1"
                >
                  Half-time
                </option>
                <option
                  key="2"
                  value="2"
                >
                  Hourly
                </option>
                <option
                  key="3"
                  value="3"
                >
                  Professional services
                </option>
              </TextField>
            </Box>
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Insert Contract
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default InsertContract;
