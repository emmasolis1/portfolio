import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
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

const HourRegistration = () => {
  const router = useRouter();
  const [lastPayment, setLastPayment] = useState('');

  useEffect(() => {
    setLastPayment(sessionStorage.getItem("lastPayment").split(' ')[0].split('/')[1] + "/" + (parseInt(sessionStorage.getItem("lastPayment").split(' ')[0].split('/')[0]) + 1) + "/" + sessionStorage.getItem("lastPayment").split(' ')[0].split('/')[2]);
  }, [lastPayment]);

  const formik = useFormik({
    initialValues: {
      projectName: '',
      employerID: '',
      employeeID: '',
      date: new Date(new Date().getTime() + new Date().getTimezoneOffset() * -60000),
      numberOfHours: '',
      hoursApprovalStatus: ''
    },
    validationSchema: Yup.object({
      numberOfHours: Yup
        .string()
        .max(5)
        .required(
          'Number of hours is required'),
      date: Yup
        .date()
    }),
    onSubmit: values => {
      var data = {
        projectName: sessionStorage.getItem("project"),
        employerID: sessionStorage.getItem("employerID"),
        employeeID: sessionStorage.getItem("employeeID"),
        date: values.date,
        numberOfHours: values.numberOfHours,
        hoursApprovalStatus: values.hoursApprovalStatus
      };
      axios.post(URL + 'hourRegistration', data)
        .then(function () {
          alert("Hours successfully registered, returning to project list");
          router.push('/projects_employee');
        })
        .catch(function (error) {
          if (error.response) {
            // The client was given an error response (5xx, 4xx)
            alert("Error: entry may already exist, returning to project list");
          } else {
            alert("Error: Unknown error occurred, returning to project list");
          }
          router.push('/projects_employee');
        });
    }
  });

  return (
    <>
      <Head>
        <title>
          Hour Registration | Ta' Bueno
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
            href="/projects_employee"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Project list
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Register the hours you worked
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
                    label="Date"
                    value={formik.values.date}
                    minDate={new Date(lastPayment)}
                    maxDate={new Date()}
                    onChange={(value) => {
                      formik.setFieldValue('date', value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>

            <TextField
              error={Boolean(formik.touched.numberOfHours && formik.errors.numberOfHours)}
              fullWidth
              helperText={formik.touched.numberOfHours && formik.errors.numberOfHours}
              label="Number of hours"
              margin="normal"
              name="numberOfHours"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.numberOfHours}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Register
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

export default HourRegistration;
