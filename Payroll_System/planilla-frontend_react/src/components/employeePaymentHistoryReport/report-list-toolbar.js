import {
  Box,
  Typography
} from '@mui/material';

export const ReportListToolbar = (props) => (
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
        Employee Payment History
      </Typography>
    </Box>
    <br></br>
    <hr></hr>
  </Box>
);
