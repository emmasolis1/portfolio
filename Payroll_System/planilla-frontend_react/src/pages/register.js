import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import axios from "axios";
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { URL } from 'src/utils/url';

const Register = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      identification: '',
      firstName: '',
      lastName: '',
      lastName2: '',
      email: '',
      password: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      address: '',
      phone: '',
      userType: ''
    },
    validationSchema: Yup.object({
      identification: Yup
        .string()
        .min(10)
        .max(10)
        .required(
          'Identification is required'),
      firstName: Yup
        .string()
        .max(255)
        .required(
          'First name is required'),
      lastName: Yup
        .string()
        .max(255)
        .required(
          'Last name is required'),
      lastName2: Yup
        .string()
        .max(255),
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required'),
      country: Yup
        .string()
        .max(50),
      state: Yup
        .string()
        .max(20),
      city: Yup
        .string()
        .max(35),
      zipCode: Yup
        .string()
        .min(5)
        .max(5),
      address: Yup
        .string()
        .max(255),
      phone: Yup
        .string()
        .min(8)
        .max(8)
        .required(
          'Phone is required')
    }),

    onSubmit: values => {
      var data = {
        Identification: values.identification,
        FirstName: values.firstName,
        LastName: values.lastName,
        LastName2: values.lastName2,
        Email: values.email,
        Password: values.password,
        Country: values.country,
        State: values.state,
        City: values.city,
        ZipCode: values.zipCode,
        Address: values.address,
        Phone: values.phone
      };
      axios.post(URL + 'register', data)
        .then(function () {
          alert("Employer successfully created, returning to login");
          router.push('/');
        })
        .catch(function (error) {
          if (error.response) {
            // The client was given an error response (5xx, 4xx)
            alert("Error: Employer may already exist, returning to register page");
          } else {
            alert("Error: Unknown error occurred, returning to register page");
          }
          router.push('/register');
        });
    }
  });

  return (
    <>
      <Head>
        <title>
          Register Employer | Ta' Bueno
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
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Sign In
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Create a new employer account
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Use your email to create a new account
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.identification && formik.errors.identification)}
              fullWidth
              helperText={formik.touched.identification && formik.errors.identification}
              label="Identification*"
              margin="normal"
              name="identification"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.identification}
              variant="outlined"
            />
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
              error={Boolean(formik.touched.lastName && formik.errors.lastName)}
              fullWidth
              helperText={formik.touched.lastName && formik.errors.lastName}
              label="Last Name*"
              margin="normal"
              name="lastName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lastName}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.lastName2 && formik.errors.lastName2)}
              fullWidth
              helperText={formik.touched.lastName2 && formik.errors.lastName2}
              label="Second Last Name"
              margin="normal"
              name="lastName2"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lastName2}
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
            <TextField
              error={Boolean(formik.touched.country && formik.errors.country)}
              fullWidth
              helperText={formik.touched.country && formik.errors.country}
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
              label="Zip code"
              margin="normal"
              name="zipCode"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.zipCode}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.address && formik.errors.address)}
              fullWidth
              helperText={formik.touched.address && formik.errors.address}
              label="Address"
              margin="normal"
              name="address"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.phone && formik.errors.phone)}
              fullWidth
              helperText={formik.touched.phone && formik.errors.phone}
              label="Phone*"
              margin="normal"
              name="phone"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone}
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
                Sign Up Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Have an account?
              {' '}
              <NextLink
                href="/login"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
