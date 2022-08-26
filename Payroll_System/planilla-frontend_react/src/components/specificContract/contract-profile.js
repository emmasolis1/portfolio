import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

export const ContractProfile = ({ contract, employeeFullName, ...props }) => {
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            {employeeFullName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            ID: {contract.employeeID}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Working for project: {contract.projectName}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
      </CardActions>
    </Card>
  );
};
