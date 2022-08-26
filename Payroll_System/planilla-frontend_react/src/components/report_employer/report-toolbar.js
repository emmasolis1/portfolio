import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';

export const ReportsToolbar = (props) => {

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          Reports
        </Typography>
      </Box>
      <br></br>
      <hr></hr>
      <br></br>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 3 }}
          variant="h5"
        >
          Choose the type of report you want to see
        </Typography>
      </Box>
      <Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <Box sx={{ m: 3 }}>
            <NextLink
              href="/projects"
              passHref
            >
              <Button
                color="primary"
                variant="contained"
              >
                Projects' payroll history
              </Button>
            </NextLink>
          </Box>
          <Box sx={{ m: 3 }}>
            <NextLink
              href="/employee_payment_history_report"
              passHref
            >
              <Button
                color="primary"
                variant="contained"
              >
                Employees' payments history
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
