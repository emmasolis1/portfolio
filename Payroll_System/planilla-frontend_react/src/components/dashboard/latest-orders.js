import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { SeverityPill } from '../severity-pill';

export const LatestOrders = ({ latestPayments, ...props }) => (
  <Card {...props}>
    <CardHeader title="Latest Payments" />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Project Name
              </TableCell>
              <TableCell>
                Date
              </TableCell>
              <TableCell>
                Total Paid
              </TableCell>
              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestPayments.map((payment) => (
              <TableRow
                hover
                key={payment.projectName}
              >
                <TableCell>
                  {payment.projectName}
                </TableCell>
                <TableCell>
                  {payment.lastPaidDate.split(' ')[0]}
                </TableCell>
                <TableCell>
                  CRC {parseFloat(payment.lastPaidAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                </TableCell>
                <TableCell>
                  <SeverityPill
                    color='success'
                  >
                    Completed
                  </SeverityPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
  </Card>
);
