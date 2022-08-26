import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useState } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { useEffect } from 'react';

export const EmployeePaymentsHistory = () => {
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        const getPaymentInfo = async () => {
            const response = await fetch("http://localhost:5150/api/paymentsHistory" + "?employeeID=" + sessionStorage.getItem("userID"));
            const data = await response.json();
            setPaymentInfo(data);
        };
        getPaymentInfo();
    }, []);
    const table =
    <body>
        Loading...
    </body>
    if (paymentInfo != null) {
        table =
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Project
                        </TableCell>
                        <TableCell>
                            Contract type
                        </TableCell>
                        <TableCell>
                            Payment date
                        </TableCell>
                        <TableCell>
                            Gross salary
                        </TableCell>
                        <TableCell>
                            Mandatory deductions
                        </TableCell>
                        <TableCell>
                            Voluntary deductions
                        </TableCell>
                        <TableCell>
                            Net salary
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentInfo.map((pay) => (
                        <TableRow
                            hover
                        >
                            <TableCell>
                                { pay.projectName }
                            </TableCell>
                            <TableCell>
                                { ContractType(pay.contractType) }
                            </TableCell>
                            <TableCell>
                                { DateFormat(pay.paymentDate) }
                            </TableCell>
                            <TableCell>
                                { pay.netSalary }
                            </TableCell>
                            <TableCell>
                                { CalculateDeduction(pay.mandatoryDeductions) }
                            </TableCell>
                            <TableCell>
                                { CalculateDeduction(pay.voluntaryDeductions) }
                            </TableCell>
                            <TableCell>
                                { pay.payment }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>;
    }

    return (
        <Card>
            <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                    {table}
                </Box>
            </PerfectScrollbar>
        </Card>
    );
};
const ContractType = (typeNumber) => {
    if (typeNumber == 0) {
        return "Full-time employee";
    } else if (typeNumber == 1) {
        return "Half-time employee";
    } else if (typeNumber == 2) {
        return "Hourly employee";
    } else if (typeNumber == 3) {
        return "Professional services";
    } else {
        return "undefined";
    }
}

const CalculateDeduction = (deductionArray) => {
    let totalDeduction = 0;
    for (let i = 0; i < deductionArray.length; i++) {
        totalDeduction += deductionArray[i].paymentDeduction;
    }
    return totalDeduction;
}

const DateFormat = (date) => {
    return date.split(" ", 1);
}

export default EmployeePaymentsHistory;
