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

const CreateVoluntaryDeduction = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      voluntaryDeductionName: '',
      projectName: '',
      employerID: '',
      description: '',
      cost: ''
    },
    validationSchema: Yup.object({
      voluntaryDeductionName: Yup
        .string()
        .max(255)
        .required(
          'Voluntary deduction name is required'),
      description: Yup
        .string()
        .max(255),
      cost: Yup
        .string()
        .max(255)
        .required(
          'Cost is required'),
    }),
    onSubmit: values => {
      var data = {
        voluntaryDeductionName: values.voluntaryDeductionName,
        projectName: sessionStorage.getItem("project"),
        employerID: sessionStorage.getItem("employerID"),
        description: values.description,
        cost: values.cost
      };
      axios.post(URL + 'voluntaryDeductions', data)
        .then(function () {
          alert("Voluntary Deduction successfully created, returning to voluntary deduction list");
          router.push('/voluntaryDeductions');
        })
        .catch(function (error) {
          if (error.response) {
            // The client was given an error response (5xx, 4xx)
            alert("Error: Voluntary Deduction may already exist, returning to voluntary deduction list");
          } else {
            alert("Error: Unknown error occurred, returning to voluntary deduction list");
          }
          router.push('/voluntaryDeductions');
        });
    }
  });

  return (
    <>
      <Head>
        <title>
          New Voluntary Deduction | Ta' Bueno
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
            href="/voluntaryDeductions"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Voluntary Deduction
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Create a new voluntary deduction
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.voluntaryDeductionName && formik.errors.voluntaryDeductionName)}
              fullWidth
              helperText={formik.touched.voluntaryDeductionName && formik.errors.voluntaryDeductionName}
              label="Voluntary Deduction Name"
              margin="normal"
              name="voluntaryDeductionName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.voluntaryDeductionName}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Description"
              margin="normal"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.cost && formik.errors.cost)}
              fullWidth
              helperText={formik.touched.cost && formik.errors.cost}
              label="Cost"
              margin="normal"
              name="cost"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.cost}
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
                Create Voluntary Deduction
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

export default CreateVoluntaryDeduction;
