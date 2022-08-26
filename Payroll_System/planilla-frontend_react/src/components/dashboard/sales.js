import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Router from 'next/router';

export const Sales = ({ employeeTypes, ...props }) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [],
        label: 'FullTime',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#14B8A6',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [],
        label: 'PartTime',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#FFB020',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [],
        label: 'Hourly',
        maxBarThickness: 10
      },
      {
        backgroundColor: '#D14343',
        barPercentage: 0.5,
        barThickness: 12,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: [],
        label: 'Professional Services',
        maxBarThickness: 10
      }
    ],
    labels: []
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
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

  function setData() {
    employeeTypes.map(employeeType => {
      data.datasets[0].data.push(employeeType.totalFullTime);
      data.datasets[1].data.push(employeeType.totalPartTime);
      data.datasets[2].data.push(employeeType.totalHourly);
      data.datasets[3].data.push(employeeType.totalProfessionalServices);
      data.labels.push(employeeType.projectName);
    }
    );
  }

  setData();

  return (
    <Card {...props}>
      <CardHeader
        title="Types of Employees by Project"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          onClick={() => { Router.push('/projects'); }}
          size="small"
        >
          Projects
        </Button>
      </Box>
    </Card>
  );
};
