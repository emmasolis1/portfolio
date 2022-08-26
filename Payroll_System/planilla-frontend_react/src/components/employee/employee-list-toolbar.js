import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';

export const EmployeeListToolbar = (props) => {
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
          Employees
        </Typography>
        <Box sx={{ m: 1 }}>
          <NextLink
            href="/create_employee"
            passHref
          >
            <Button
              color="primary"
              variant="contained"
            >
              Add Employee
            </Button>
          </NextLink>
        </Box>
      </Box>
      <br></br>
      <hr></hr>
    </Box>
  );
}
