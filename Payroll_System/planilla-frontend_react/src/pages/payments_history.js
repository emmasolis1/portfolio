import Head from 'next/head';
import React from 'react';
import { Typography } from '@mui/material';
import { Box, Container } from '@mui/material';
import { EmployeePaymentsHistory } from '../components/report/report-payments-employee';
import { DashboardLayout } from '../components/dashboard-layout';
import { URL } from 'src/utils/url';

class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            APIUrl: URL + 'reports',
        };
    }

    render() {
        return (
            <>
                <Head>
                    <title>
                        Reports | Ta' Bueno
                    </title>
                </Head>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8
                    }}
                >
                    <Container maxWidth={false}>
                        <Typography
                            sx={{ m: 1 }}
                            variant="h4"
                        >
                            Payment history
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <EmployeePaymentsHistory/>
                        </Box>
                    </Container>
                </Box>
            </>
        );
    }
}
Reports.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Reports;
