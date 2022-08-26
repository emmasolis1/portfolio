import Head from 'next/head';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Button, Container, FormControl, FormControlLabel,
  FormLabel, Link, Radio, RadioGroup, TextField, Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { URL } from 'src/utils/url';

const Login = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
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
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required')
    }),
    onSubmit: () => {
      // Validate user and password, and get user ID
      axios.get(URL + 'getUserData' + "?email=" + formik.values.email + "&password=" + formik.values.password)
        .then(response => {
          if (response.data[0] != "" && response.data[1] != "") {
            // Stores the user's data on sessionStorage
            sessionStorage.setItem("email", formik.values.email);
            sessionStorage.setItem("userType", response.data[1]);
            sessionStorage.setItem("userFullname", response.data[2]);
            sessionStorage.setItem("userProjects", response.data[3]);
            // Stores the user's ID on sessionStorage and sends them to their respective main page
            if (response.data[1] === "0") {
              sessionStorage.removeItem("employeeID");
              sessionStorage.setItem("employerID", response.data[0]);
              router.push('/dashboard');
            }
            else {
              sessionStorage.removeItem("employerID");
              sessionStorage.setItem("employeeID", response.data[0]);
              router.push('/dashboardEmployee');
            }
            sessionStorage.setItem("userID", response.data[0]);
          } else {
            alert("Error: User doesn't exist or password is incorrect");
          }
        });
    }
  });

  return (
    <>
      <Head>
        <title>Login | Ta' Bueno</title>
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
          <Typography
            color="textPrimary"
            variant="h2"
            align="center"
          >
            Ta' Bueno
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Sign in
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Sign in on the internal platform
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
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
              label="Password"
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
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
