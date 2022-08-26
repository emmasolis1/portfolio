import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';

export const BenefitListToolbar = (props) => (
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
        Benefits
      </Typography>
      <Box sx={{ m: 1 }}>
        <NextLink
          href="/create_benefit"
          passHref
        >
          <Button
            color="primary"
            variant="contained"
          >
            Add Benefit
          </Button>
        </NextLink>
      </Box>
    </Box>
    <br></br>
    <hr></hr>
  </Box>
);
