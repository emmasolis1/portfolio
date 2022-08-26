import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';

export const ContractProfileDetails = ({ contract, ...props }) => {
  const contractTypeString = "";
  if (contract.contractType == "0") {
    contractTypeString = "Full time";
  }
  else if (contract.contractType == "1") {
    contractTypeString = "Half time";
  }
  else if (contract.contractType == "2") {
    contractTypeString = "Hourly";
  }
  else if (contract.contractType == "3") {
    contractTypeString = "Professional services";
  }

  const formik = useFormik({
    initialValues: {
      startDate: contract.startDate,
      expectedEndingDate: contract.expectedEndingDate,
      position: contract.position,
      schedule: contract.schedule,
      netSalary: contract.netSalary,
      contractType: contractTypeString
    }
  });

  return (
    <form>
      <Card>
        <CardHeader
          title="Contract's information:"
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
                label="Start date"
                margin="none"
                value={formik.values.startDate.split(' ')[0]}
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
                label="Ending date"
                margin="none"
                value={formik.values.expectedEndingDate.split(' ')[0]}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Position"
                margin="none"
                value={formik.values.position}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Schedule"
                margin="none"
                value={formik.values.schedule}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Net salary"
                margin="none"
                value={formik.values.netSalary}
                disabled={true}
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Contrac type"
                margin="none"
                value={formik.values.contractType}
                disabled={true}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </form>
  );
};
