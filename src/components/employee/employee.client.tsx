'use client';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useGetEmployeeList } from '@/hooks/employee-hooks/get-employee-list';
import { useHeaderTitle } from '@/hooks/header-title';
import { useGetRoles } from '@/hooks/employee-hooks/get-roles';
import {  EmployeeListType, ExportEmployeeBinder, FilterPayloadForEmployee } from '@/constants/employee';
import { useGetEmployeeListCount } from '@/hooks/employee-hooks/get-employee-count';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useBusinessCenter } from '@/contexts/businesscenter-context';
import { EmployeeAssignDialog } from './employe-assigne-dialog';
import { useDialog } from '@/hooks/use-dialog';
import EmployeeTableContainer from './employee-table-container';
import FallbackLoader from '../fallback-loader/loader';
import { useEmployeeContext } from '@/contexts/employee-context';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useExportEmployees } from '@/hooks/employee-hooks/use-export-employees';

interface MenuItemClientPageProps {
    firstName?: string;
    lastName?: string;
    empId?: string;
    role?: string[];
    email?: string;
}

const EmployeeClient = ({ firstName, lastName, email, empId, role }: MenuItemClientPageProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const { roles, loading: roleLoading } = useGetRoles()
    const { employees, loading, fetchEmployeeList, error: employeeListError } = useGetEmployeeList(EmployeeListType?.Assigned);
    const { t } = useTranslation();
    const { selectedBCId } = useBusinessCenter();
    const { error: employeeListCountError, employeesCount, fetchEmployeeListCount } = useGetEmployeeListCount(EmployeeListType?.Assigned);
    const { setHeaderTitle } = useHeaderTitle();
    const { open, handleOpen, handleClose } = useDialog();
    const { setAssignedEmployee } = useEmployeeContext();
    const { exportEmployees } = useExportEmployees();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    // this useffect will run only when open is false
    useEffect(() => {
        if (!open) {
            const requestBody = {
                employeeId: empId ?? '',
                firstName: firstName ?? '',
                lastName: lastName ?? '',
                email: email ?? '',
                role: role ?? [],
            }
            const payLoad = FilterPayloadForEmployee?.BindForm(requestBody);
            fetchEmployeeList(rowsPerPage, payLoad,'', null);
            fetchEmployeeListCount(payLoad);
        }
    }, [email, empId, firstName, lastName, role, rowsPerPage, open]);

    useEffect(()=>{
        if(selectedBCId){
            setAssignedEmployee([]);
        }
    },[selectedBCId])

    const handlePageChange = (event: unknown, newPage: number) => {
        const requestBody = {
            employeeId: empId ?? '',
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            email: email ?? '',
            role: role ?? [],
        }
        const payLoad = FilterPayloadForEmployee?.BindForm(requestBody);
        if (newPage > page) {
            fetchEmployeeList(rowsPerPage, payLoad, employees?.cursorData?.after ?? '', null)
        } else {
            fetchEmployeeList(rowsPerPage, payLoad, null, employees?.cursorData?.before)
        }
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchEmployeeList(rowsPerPage);
        fetchEmployeeListCount();
    }, [rowsPerPage, selectedBCId])

    useEffect(() => {
        setHeaderTitle(t('Employee:employees'));
        const error = employeeListCountError || employeeListError;
        if (error) {
            toast.error(error);
        };
    }, [employeeListCountError, employeeListError]);

    const handleExportEmployees = (type: 'excel' | 'csv') => {
        const payload = ExportEmployeeBinder?.bind({
                        type: type,
                        nodeRef: Number(selectedBCId),
                    });
        exportEmployees(payload);
    };

    return (
        <Box
            sx={{
                maxWidth: "var(--Content-maxWidth)",
                m: "var(--Content-margin)",
                p: "var(--Content-padding)",
                py: 2,
                width: "var(--Content-width)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2
                }}
            >
                <Button
                    onClick={handleOpenMenu}
                    endIcon={<ArrowDropDownIcon />} 
                >
                    {t('Employee:export')}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={() => handleExportEmployees('excel')}>
                        {t('Employee:export_to_excel')}
                    </MenuItem>
                    <MenuItem onClick={() => handleExportEmployees('csv')}>
                        {t('Employee:export_to_csv')}
                    </MenuItem>
                </Menu>
            </Box>

            <EmployeeTableContainer
                employees={employees}
                loading={loading}
                roleLoading={roleLoading}
                roles={roles}
                filters={{ firstName, lastName, email, empId, role }}
                employeesCount={employeesCount ?? 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                fetchEmployeeList={fetchEmployeeList}
                displayColumn={['employeeId', 'firstName', 'lastName', 'email', 'role', 'lastUpdatedBy', 'lastUpdatedAt', 'actions']}
                enableBulkUnassign={true}
            />

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                <Button sx={{ color: "#212636" }}>{t('Employee:assign_more')}</Button>
                <Typography
                    sx={{ cursor: "pointer", color: "primary.main" }}
                    onClick={()=>{
                        setAssignedEmployee([]);
                        handleOpen()
                    }}
                >
                    {t('Employee:click_here')}
                </Typography>
                {

                    open && <EmployeeAssignDialog
                        close={handleClose}
                        open={open}
                        reFetchEmployeeList={(() => fetchEmployeeList)}
                        firstName={firstName}
                        lastName={lastName}
                        email={email}
                        empId={empId}
                    />
                }
            </Box>
            {loading && <FallbackLoader />}
            </Box>
    )
}

export default EmployeeClient;