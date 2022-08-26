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

  report.mandatoryDeductions.map((deduction) => (
    deduction.percentage = parseFloat(deduction.percentage.replace(/,/, '.'))
  ))

  let mandatoryDeductionsTotal = 0;
  report.mandatoryDeductions.map((deduction) => (
    mandatoryDeductionsTotal += parseFloat((parseFloat(report.netSalary0) + parseFloat(report.netSalary1) + parseFloat(report.netSalary3)) * (parseFloat(deduction.percentage) / 100))
  ))

  let benefitsTotal = 0;
  report.benefits.map((benefit) => (
    benefitsTotal += parseFloat(benefit.percentage)
  ))

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
              Payment Date: {report.paymentDate.split(' ')[0]}
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
              Salary
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Type of employee
                  </TableCell>
                  <TableCell>
                    Gross Salary
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  hover
                >
                  <TableCell>
                    Full-time employees:
                  </TableCell>
                  <TableCell>
                    CRC {parseFloat(report.netSalary0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </TableCell>
                </TableRow>
                <TableRow
                  hover
                >
                  <TableCell>
                    Half-time employees:
                  </TableCell>
                  <TableCell>
                    CRC {parseFloat(report.netSalary1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </TableCell>
                </TableRow>
                <TableRow
                  hover
                >
                  <TableCell>
                    Professional services employees:
                  </TableCell>
                  <TableCell>
                    CRC {parseFloat(report.netSalary3).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Total salary
                  </TableCell>
                  <TableCell>
                    CRC {(parseFloat(parseFloat(report.netSalary0) + parseFloat(report.netSalary1) + parseFloat(report.netSalary3)).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
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
                      CRC {(((parseFloat(report.netSalary0) + parseFloat(report.netSalary1) + parseFloat(report.netSalary3)) * (parseFloat(deduction.percentage) / 100)).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Total from mandatory deductions
                  </TableCell>
                  <TableCell>
                    CRC {mandatoryDeductionsTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
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
              Benefits
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Benefit
                  </TableCell>
                  <TableCell>
                    Cost
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.benefits.map((benefit) => (
                  <TableRow
                    hover
                    key={benefit.name}
                  >
                    <TableCell>
                      {benefit.name}
                    </TableCell>
                    <TableCell>
                      CRC {benefit.percentage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Total from benefits
                  </TableCell>
                  <TableCell>
                    CRC {benefitsTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
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
