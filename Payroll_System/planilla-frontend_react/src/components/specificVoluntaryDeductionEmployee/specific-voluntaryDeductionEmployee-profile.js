import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

export const SpecificVoluntaryDeductionEmployeeProfile = ({voluntaryDeduction, ...props}) => {
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
            {voluntaryDeduction.voluntaryDeductionName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Based on project: {voluntaryDeduction.projectName}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};