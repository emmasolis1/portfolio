import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

export const SpecificBenefitProfile = ({ benefit, ...props }) => {
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
            {benefit.benefitName}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Based on project: {benefit.projectName}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
      </CardActions>
    </Card>
  );
};
