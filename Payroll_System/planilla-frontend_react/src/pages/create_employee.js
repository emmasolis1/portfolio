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
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { URL } from 'src/utils/url';

const Register = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      surname: '',
      secondSurname: '',
      identification: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      address: '',
      zipCode: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      firstName: Yup
        .string()
        .max(255)
        .required(
          'First name is required'),
      surname: Yup
        .string()
        .max(255)
        .required(
          'Surname is required'),
      secondSurname: Yup
        .string()
        .max(50),
      identification: Yup
        .string()
        .max(10)
        .min(10)
        .required(
          'Identification is required'),
      phone: Yup
        .string()
        .min(8)
        .max(8)
        .required(
          'Phone number is required'),
      country: Yup
        .string()
        .max(20),
      state: Yup
        .string()
        .max(50),
      city: Yup
        .string()
        .max(50),
      address: Yup
        .string()
        .max(255),
      zipCode: Yup
        .string()
        .max(5),
      password: Yup
        .string()
        .max(255)
        .min(8, 'Password must be at least 8 characters long')
        .required(
          'Password is required'),
    }),
    onSubmit: values => {
      var data = {
        Identification: values.identification,
        Firstname: values.firstName,
        LastName: values.surname,
        LastName2: values.secondSurname,
        Email: values.email,
        Password: values.password,
        Country: values.country,
        State: values.state,
        City: values.city,
        ZipCode: values.zipCode,
        Address: values.address,
        Phone: values.phone
      };
      axios.post(URL + 'employees', data);
      router.push('/employees');
    }
  });

  return (
    <>
      <Head>
        <title>
          New Employee | Ta' Bueno
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
            href="/employees"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Employees
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Register a new employee
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Use the employee's email to create the new account
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.firstName && formik.errors.firstName)}
              fullWidth
              helperText={formik.touched.firstName && formik.errors.firstName}
              label="First Name*"
              margin="normal"
              name="firstName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.firstName}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.surname && formik.errors.surname)}
              fullWidth
              helperText={formik.touched.surname && formik.errors.surname}
              label="Surname*"
              margin="normal"
              name="surname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.surname}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.secondSurname && formik.errors.secondSurname)}
              fullWidth
              helperText={formik.touched.secondSurname && formik.errors.secondSurname}
              label="Second Surname"
              margin="normal"
              name="secondSurname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.secondSurname}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.identification && formik.errors.identification)}
              fullWidth
              helperText={formik.touched.identification && formik.errors.identification}
              label="Identification (SSN)*"
              margin="normal"
              name="identification"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.identification}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              fullWidth
              helperText={formik.touched.phone && formik.errors.phone}
              label="Phone Number*"
              margin="normal"
              name="phone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.state && formik.errors.state)}
              fullWidth
              helperText={formik.touched.state && formik.errors.state}
              label="Country"
              margin="normal"
              name="country"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.country}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.state && formik.errors.state)}
              fullWidth
              helperText={formik.touched.state && formik.errors.state}
              label="State"
              margin="normal"
              name="state"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.state}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.city && formik.errors.city)}
              fullWidth
              helperText={formik.touched.city && formik.errors.city}
              label="City"
              margin="normal"
              name="city"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.city}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.zipCode && formik.errors.zipCode)}
              fullWidth
              helperText={formik.touched.zipCode && formik.errors.zipCode}
              label="Address"
              margin="normal"
              name="address"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.zipCode && formik.errors.zipCode)}
              fullWidth
              helperText={formik.touched.zipCode && formik.errors.zipCode}
              label="Zip Code"
              margin="normal"
              name="zipCode"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.zipCode}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address*"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password*"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
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
                Register Employee
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
