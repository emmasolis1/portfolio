import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Stack
} from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { URL } from 'src/utils/url';

export const ProjectProfileDetails = ({ project, ...props }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      budget: project.budget,
      paymentMethod: project.paymentMethod,
      description: project.description,
      maxNumberOfBenefits: project.maxNumberOfBenefits,
      maxBudgetForBenefits: project.maxBudgetForBenefits,
    },
    validationSchema: Yup.object({
      budget: Yup
        .string(),
      paymentMethod: Yup
        .string()
        .max(50),
      description: Yup
        .string()
        .max(255),
      maxNumberOfBenefits: Yup
        .number().typeError("Invalid input, please insert a number"),
      maxBudgetForBenefits: Yup
        .string(),
    }),
    onSubmit: values => {
      var data = {
        projectName: project.projectName,
        employerID: project.employerID,
        budget: values.budget,
        paymentMethod: values.paymentMethod,
        description: values.description,
        maxNumberOfBenefits: values.maxNumberOfBenefits,
        maxBudgetForBenefits: values.maxBudgetForBenefits
      };
      axios.put(URL + 'specificProject', data).then((response) => {
        alert("Project updated successfully");
        router.push('/specificProject');
      });
    }
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (agreed) => {
    setOpen(false);
    if (agreed === true) {
      axios.delete(URL + "deleteProject?projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(() => {
        alert("Project deleted successfully");
        router.push('/projects');
      });
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
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
                name="budget"
                error={Boolean(formik.touched.budget && formik.errors.budget)}
                helperText={formik.touched.budget && formik.errors.budget}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
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
                name="maxNumberOfBenefits"
                error={Boolean(formik.touched.maxNumberOfBenefits && formik.errors.maxNumberOfBenefits)}
                helperText={formik.touched.maxNumberOfBenefits && formik.errors.maxNumberOfBenefits}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.maxBudgetForBenefits && formik.errors.maxBudgetForBenefits)}
                fullWidth
                helperText={formik.touched.maxBudgetForBenefits && formik.errors.maxBudgetForBenefits}
                label="Max Budget for Benefits"
                margin="none"
                name="maxBudgetForBenefits"
                value={formik.values.maxBudgetForBenefits}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
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
                name="description"
                error={Boolean(formik.touched.description && formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
            >
              Save details
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleClickOpen()}
            >
              Delete Project
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Alert: Please read!!!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You are about to delete a project, this means
                  that you also will terminate the contracts of all
                  the involved employees. Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary">Cancel</Button>
                <Button onClick={() => handleClose(true)} variant="contained" color="error">Delete Project</Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Box>
      </Card>
    </form>
  );
};
