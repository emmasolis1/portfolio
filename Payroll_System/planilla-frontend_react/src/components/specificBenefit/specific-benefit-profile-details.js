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

export const SpecificBenefitProfileDetails = ({ benefit, ...props }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      projectName: benefit.projectName,
      employerID: benefit.employerID,
      description: benefit.description,
      cost: benefit.cost,
    },
    validationSchema: Yup.object({
      description: Yup
        .string()
        .max(255),
      cost: Yup
        .string(),
    }),
    onSubmit: values => {
      var data = {
        benefitName: benefit.benefitName,
        projectName: benefit.projectName,
        employerID: benefit.employerID,
        description: values.description,
        cost: values.cost
      };
      axios.put(URL + 'specificBenefit', data).then((response) => {
        alert("Benefit updated successfully");
      });
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (agreed) => {
    setOpen(false);
    if (agreed === true) {
      axios.delete(URL + "deleteBenefit?benefitName=" + sessionStorage.getItem("benefit") + "&projectName=" + sessionStorage.getItem("project") + "&employerID=" + sessionStorage.getItem("employerID")).then(() => {
        alert("Benefit deleted successfully");
        router.push('/benefits');
      });
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          title="Benefit's information:"
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
                label="Employer ID"
                margin="none"
                value={formik.values.employerID}
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
                label="Cost"
                margin="none"
                value={formik.values.cost}
                name="cost"
                error={Boolean(formik.touched.cost && formik.errors.cost)}
                helperText={formik.touched.cost && formik.errors.cost}
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
              Delete Benefit
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
                  You are about to delete a benefit, this means
                  that everyone linked to it will lose access to it.
                  Are you sure?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary">Cancel</Button>
                <Button onClick={() => handleClose(true)} variant="contained" color="error">Delete</Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Box>
      </Card>
    </form>
  );
};
