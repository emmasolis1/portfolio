import Head from 'next/head';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
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
      projectName: '',
      employerID: '',
      budget: '',
      paymentMethod: 'Weekly',
      description: '',
      maxNumberOfBenefits: '',
      maxBudgetForBenefits: ''
    },
    validationSchema: Yup.object({
      projectName: Yup
        .string()
        .max(255)
        .required(
          'Project name is required')
    }),
    onSubmit: values => {
      var data = {
        projectName: values.projectName,
        employerID: sessionStorage.getItem("employerID"),
        budget: values.budget,
        paymentMethod: values.paymentMethod,
        description: values.description,
        maxNumberOfBenefits: values.maxNumberOfBenefits,
        maxBudgetForBenefits: values.maxBudgetForBenefits
      };
      axios.post(URL + 'projects', data)
        .then(function () {
          alert("Project successfully created, returning to project list");
          router.push('/projects');
        })
        .catch(function (error) {
          if (error.response) {
            // The client was given an error response (5xx, 4xx)
            alert("Error: Project may already exist, returning to project list");
          } else {
            alert("Error: Unknown error occurred, returning to project list");
          }
          router.push('/projects');
        });
    }
  });

  return (
    <>
      <Head>
        <title>
          Register | Material Kit
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
            href="/projects"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Projects
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Create a new project
              </Typography>

            </Box>
            <TextField
              error={Boolean(formik.touched.projectName && formik.errors.projectName)}
              fullWidth
              helperText={formik.touched.projectName && formik.errors.projectName}
              label="Project Name"
              margin="normal"
              name="projectName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.projectName}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Short description"
              margin="normal"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              variant="outlined"
            />
            <Box>
              <TextField
                fullWidth
                label="Payment Method"
                margin="normal"
                name="paymentMethod"
                onChange={formik.handleChange}
                select
                SelectProps={{ native: true }}
                value={formik.values.paymentMethod}
                variant="outlined"
              >
                <option
                  key="0"
                  value="Weekly"
                >
                  Weekly
                </option>
                <option
                  key="1"
                  value="Biweekly"
                >
                  Biweekly
                </option>
                <option
                  key="2"
                  value="Monthly"
                >
                  Monthly
                </option>
              </TextField>
            </Box>
            <TextField
              error={Boolean(formik.touched.budget && formik.errors.budget)}
              fullWidth
              helperText={formik.touched.budget && formik.errors.budget}
              label="Budget"
              margin="normal"
              name="budget"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.budget}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.maxNumberOfBenefits && formik.errors.maxNumberOfBenefits)}
              fullWidth
              helperText={formik.touched.maxNumberOfBenefits && formik.errors.maxNumberOfBenefits}
              label="Max number of benefits"
              margin="normal"
              name="maxNumberOfBenefits"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.maxNumberOfBenefits}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.maxBudgetForBenefits && formik.errors.maxBudgetForBenefits)}
              fullWidth
              helperText={formik.touched.maxBudgetForBenefits && formik.errors.maxBudgetForBenefits}
              label="Max budget for benefits"
              margin="normal"
              name="maxBudgetForBenefits"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.maxBudgetForBenefits}
              variant="outlined"
            />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1
              }}
            >

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
                Create project
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
