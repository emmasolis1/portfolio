import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';

export const VoluntaryDeductionEmployeeListToolbar = (props) => (
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
        Voluntary Deduction
      </Typography>
      <Box sx={{ m: 1 }}>
        <NextLink
          href="/voluntary_deduction_list"
          passHref
        >
          <Button
            color="primary"
            variant="contained"
          >
            Voluntary Deduction List
          </Button>
        </NextLink>
      </Box>
    </Box>
    <br></br>
    <hr></hr>
  </Box>
);
