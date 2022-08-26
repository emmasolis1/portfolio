import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';

export const VoluntaryDeductionListToolbar = (props) => (
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
          href="/create_voluntary_deduction"
          passHref
        >
          <Button
            color="primary"
            variant="contained"
          >
            Add Voluntary Deduction
          </Button>
        </NextLink>
      </Box>
    </Box>
    <br></br>
    <hr></hr>
  </Box>
);
