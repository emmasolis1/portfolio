import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';

export const SpecificEmployeeProfileDetails = ({ user, ...props }) => {
  const formik = useFormik({
    initialValues: {
      email: user.Email,
      firstName: user.FirstName,
      surname: user.LastName,
      secondSurname: user.LastName2,
      identification: user.Identification,
      phone: user.Phone,
      country: user.Country,
      state: user.State,
      city: user.City,
      address: user.Address,
      zipCode: user.ZipCode,
      password: ''
    }
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="View employee information."
          title="Profile"
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
                label="First Name"
                margin="none"
                value={formik.values.firstName}
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
                label="Surname"
                margin="none"
                value={formik.values.surname}
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
                label="Secon Surname"
                margin="none"
                value={formik.values.secondSurname == null ? 'No second surname registered' : formik.values.secondSurname}
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
                label="Email"
                margin="none"
                value={formik.values.email}
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
                label="Phone"
                margin="none"
                value={formik.values.phone}
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
                label="Country"
                margin="none"
                value={formik.values.country == null ? 'No registered Country' : formik.values.country}
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
                label="State"
                margin="none"
                value={formik.values.city == null ? 'No registered State' : formik.values.state}
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
                label="City"
                margin="none"
                value={formik.values.city == null ? 'No registered City' : formik.values.city}
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
                label="Zip Code"
                margin="none"
                value={formik.values.zipCode == null ? 'No registered Zip Code' : formik.values.zipCode}
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
                label="Address"
                margin="none"
                value={formik.values.address == null ? 'No registered Address' : formik.values.address}
                disabled={true}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
