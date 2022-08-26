import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const EmployeeListToolbar = ({ projectName, ...props }) => {
  const prevPage = "/projects";
  const nextPage = "/add_employee_to_project";
  const pageTitle = projectName + "'s employees";
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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1
          }}
        >
          <NextLink
            href={prevPage}
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
            </Button>
          </NextLink>
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            {pageTitle}
          </Typography>
        </Box>
        <Box sx={{ m: 1 }}>
          <NextLink
            href={nextPage}
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
