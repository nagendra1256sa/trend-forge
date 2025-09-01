'use client';
import { Box, Button, Card, Divider, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EmployeeTable from './employee.table';
import { CustomPagination } from '../core/table-pagination';
import FallbackLoader from '../fallback-loader/loader';
import { EmployeeFilters } from './employee.filters';
import { BCEmployees } from '@/models/employee';
import { Role } from '@/models/role';
import { useBulkRemoveEmployees } from '@/hooks/employee-hooks/use-bulk-employee-remove';
import { useBusinessCenter } from '@/contexts/businesscenter-context';
import { useEmployeeContext } from '@/contexts/employee-context';
import { useDialog } from '@/hooks/use-dialog';
import { CommonAlertDialog } from '../core/common-alert-dialog';
import { BulkRemoveEmployeeBinder, EmployeeFilter, FilterPayloadForEmployee } from '@/constants/employee';
import { useTranslation } from 'react-i18next';

interface EmployeeTableContainerProps {
    employees: BCEmployees;
    loading: boolean;
    roleLoading?: boolean;
    roles?: Role[];
    filters: {
        firstName?: string;
        lastName?: string;
        empId?: string;
        role?: string[];
        email?: string;
    };
    employeesCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fetchEmployeeList: (limit: number, filters?: EmployeeFilter[], after?: string | null, before?: string | null) => Promise<void>;
    displayColumn: string[]
    enableBulkUnassign?: boolean;
}

const EmployeeTableContainer = ({
    employees,
    loading,
    roleLoading,
    roles,
    filters,
    employeesCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    fetchEmployeeList,
    displayColumn,
    enableBulkUnassign = false,
}: EmployeeTableContainerProps) => {
    const { assignedEmployee, setAssignedEmployee } = useEmployeeContext();
    const [includeIds, setIncludeIds] = useState<number[]>([]);
    const { bulkRemoveEmployee, loading: bulkRemoveLoading, isRemoved } = useBulkRemoveEmployees();
    const { selectedBCId } = useBusinessCenter();
    const { handleClose, handleOpen, open } = useDialog();
    const { t } = useTranslation();

    useEffect(() => {
        if (isRemoved) {
            const requestBody = {
                employeeId: filters?.empId ?? '',
                firstName: filters?.firstName ?? '',
                lastName: filters?.lastName ?? '',
                email: filters?.email ?? '',
                role: filters?.role ?? [],
            }
            const payLoad = FilterPayloadForEmployee?.BindForm(requestBody);
            fetchEmployeeList(rowsPerPage, payLoad, '', null);
        }
    }, [isRemoved]);

    const handleBulkUnassign = async () => {
        if (!assignedEmployee || assignedEmployee?.length === 0) return;

        setIncludeIds(assignedEmployee?.map(emp => emp?.id));
        handleOpen();
    };
    const handleCloseUnassign = (isAgree: boolean) => {
        if (isAgree) {
            const payload = BulkRemoveEmployeeBinder?.bind({
                includeIds: includeIds,
                nodeRef: Number(selectedBCId)
            });
            bulkRemoveEmployee(payload);
            setAssignedEmployee([]);
        }
        handleClose();
    };
    return (
        <Stack spacing={-3}>
            <Card
            >
                <Divider />
                <Box
                >
                    {
                        (loading || roleLoading || bulkRemoveLoading) && <FallbackLoader />
                    }
                    <Box sx={{ display: "flex" }}>
                        <EmployeeFilters filters={filters} roles={roles} />
                        {assignedEmployee?.length > 0 && enableBulkUnassign && (<>
                            <Button onClick={handleBulkUnassign}>
                                {t("Employee:remove")}
                            </Button>
                        </>
                        )}
                    </Box>
                        <EmployeeTable
                            rowPerPage={rowsPerPage}
                            rows={employees?.employees ?? []}
                            refetchEmployeesList={fetchEmployeeList ?? (() => {})}
                            displayColumn={displayColumn}
                            tableSelection={true}
                        />
                    {employees && (
                        <CustomPagination
                            count={employeesCount}
                            page={page}
                            onPageChange={onPageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={onRowsPerPageChange}
                            rowsPerPageOptions={[25, 50, 100]}
                        />
                    )}
                    {open && (
                        <CommonAlertDialog
                            isOpen={open}
                            onClose={handleCloseUnassign}
                            title={t("Employee:unassign_title")}
                            message={t("Employee:unassign_all_message")}
                        />
                    )}
                </Box>
                <Divider />
            </Card>
        </Stack>
    )
}

export default EmployeeTableContainer;