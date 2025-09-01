import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useEmployeeContext } from "@/contexts/employee-context";
import { useTranslation } from "react-i18next";
import EmployeeTableContainer from "./employee-table-container";
import { BCEmployees } from "@/models/employee";
import { EmployeeFilter } from "@/constants/employee";

interface EmployeeAssignTableProps {
    employees: BCEmployees; 
    loading: boolean;
    filters: {
        firstName?: string;
        lastName?: string;
        email?: string;
        empId?: string;
    };
    employeesCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fetchEmployeeList: (limit: number, filters?: EmployeeFilter[], after?: string | null, before?: string | null) => Promise<void>;
}

export default function EmployeeAssignTable({
    employees,
    loading,
    filters,
    employeesCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    fetchEmployeeList
}: EmployeeAssignTableProps) {
    const { assignedEmployee, setAssignedEmployee } = useEmployeeContext();
    const { t } = useTranslation();
    const employeeArray = employees?.employees || [];

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} mt={1}>
                <Typography variant="h6" gutterBottom component="div">
                    {assignedEmployee?.length} {t('Employee:selected')}
                </Typography>

                <Box display="flex" gap={2}>
                    {assignedEmployee?.length > 0 && (
                        <Button onClick={() => setAssignedEmployee([])}>Clear</Button>
                    )}
                    {employeeArray?.length !== assignedEmployee?.length && (
                        <Button onClick={() => setAssignedEmployee(employeeArray)}>
                           {t('Employee:select_all', { count: employeeArray?.length })}
                        </Button>
                    )}
                </Box>
            </Box>

            <EmployeeTableContainer
                employees={employees}
                loading={loading}
                filters={filters}
                employeesCount={employeesCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                fetchEmployeeList={fetchEmployeeList}
                displayColumn={['employeeId', 'firstName', 'lastName', 'email', 'lastUpdatedBy', 'lastUpdatedAt', 'editActions']}
            />
        </>
    );
}