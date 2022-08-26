import {
  Box,
  Button,
  Typography
} from '@mui/material';
import NextLink from 'next/link';

export const ProjectListToolbar = (props) => (
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
        Projects
      </Typography>
      <Box sx={{ m: 1 }}>
        <NextLink
          href="/project_form"
          passHref
        >
          <Button
            color="primary"
            variant="contained"
          >
            Add projects
          </Button>
        </NextLink>
      </Box>
    </Box>
    <br></br>
    <hr></hr>
  </Box>
);
