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

export const SpecificVoluntaryDeductionEmployeeProfileDetails = ({ voluntaryDeduction, ...props }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      voluntaryDeductionName: voluntaryDeduction.voluntaryDeductionName,
      projectName: voluntaryDeduction.projectName,
      employerID: voluntaryDeduction.employerID,
      employeeID: voluntaryDeduction.employeeID,
      startDate: voluntaryDeduction.startDate,
      endingDate: voluntaryDeduction.endingDate,
      description: "",
      cost: voluntaryDeduction.cost,
    },
    validationSchema: Yup.object({
      cost: Yup
        .string(),
    }),
    onSubmit: values => {
      var data = {
        voluntaryDeductionName: voluntaryDeduction.voluntaryDeductionName,
        projectName: voluntaryDeduction.projectName,
        employerID: voluntaryDeduction.employerID,
        employeeID: voluntaryDeduction.employeeID,
        startDate: voluntaryDeduction.startDate,
        endingDate: voluntaryDeduction.endingDate,
        description: "",
        cost: values.cost,
      };
      axios.put(URL + 'specificVoluntaryDeductionEmployee', data).then((response) => {
        alert("Voluntary Deduction updated successfully");
        router.push('/voluntaryDeductionsEmployee');
      });
    }
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          title="Voluntary Deduction's information:"
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

          </Stack>
        </Box>
      </Card>
    </form>
  );
};
