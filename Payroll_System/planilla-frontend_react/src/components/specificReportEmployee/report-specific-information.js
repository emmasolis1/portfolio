import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TextField,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { URL } from 'src/utils/url';

export const SpecificReportDetails = ({ report, ...props }) => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader
        subheader="See the details of this payment."
        title="Payment Report"
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
            <Typography
              variant="body1"
              align="center"
            >
              Employee Name: {report.employeeName}
            </Typography>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <Typography
              variant="body1"
              align="center"
            >
              Payment Date: {report.paymentDate.split(' ')[0]}
            </Typography>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <Typography
              variant="body1"
              align="center"
            >
              Project Name: {report.projectName}
            </Typography>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <Typography
              variant="body1"
              align="center"
            >
              Contract Type: {report.contractType}
            </Typography>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <Typography
              variant="subtitle1"
              align="center"
            >
              Contract Salary
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Gross Salary:
                  </TableCell>
                  <TableCell>
                    CRC {parseFloat(report.netSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <Typography
              variant="subtitle1"
              align="center"
            >
              Mandatory Deductions
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Deduction
                  </TableCell>
                  <TableCell>
                    Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.mandatoryDeductions.map((deduction) => (
                  <TableRow
                    hover
                    key={deduction.name}
                  >
                    <TableCell>
                      {deduction.name}
                    </TableCell>
                    <TableCell>
                      - CRC {parseFloat(report.netSalary * (deduction.percentage / 100)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <Typography
              variant="subtitle1"
              align="center"
            >
              Voluntary Deductions
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Deduction
                  </TableCell>
                  <TableCell>
                    Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.optionalDeductions.map((deduction) => (
                  <TableRow
                    hover
                    key={deduction.name}
                  >
                    <TableCell>
                      {deduction.name}
                    </TableCell>
                    <TableCell>
                      - CRC {parseFloat(deduction.cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
          >
            <Typography
              variant="subtitle1"
              align="center"
            >
              Final Salary
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Net Salary
                  </TableCell>
                  <TableCell>
                    CRC {parseFloat(report.grossSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
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
        <Button
          color="secondary"
          variant="contained"
          type="submit"
          sx={{
            mr: 2
          }}
        >
          Download Report
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
        >
          Send to Email
        </Button>
      </Box>
    </Card>
  );
};
