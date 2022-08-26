import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

export const TrafficByDevice = ({ projects, ...props }) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00', '#00C853'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: []
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [];

  function setData() {
    projects.map(project => {
      data.datasets[0].data.push(project.totalIncome);
      data.labels.push(project.projectName);
    });
  }

  function setDevices() {
    // find total cost for all projects
    let total_sum = 0;
    projects.forEach(element => {
      total_sum += parseFloat(element.totalIncome);
    });
    projects.map(project => {
      devices.push({
        title: project.projectName,
        value: project.totalIncome,
        icon: LaptopMacIcon,
        color: '#3F51B5',
        total_sum: total_sum
      });
    }
    );
  }

  setData();
  setDevices();

  return (
    <Card {...props}>
      <CardHeader title={"Total Income from Projects"} />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value,
            total_sum
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h6"
              >
                {parseFloat(value / total_sum * 100).toFixed(0)}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
