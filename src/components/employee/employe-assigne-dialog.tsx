import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Step, StepLabel, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetEmployeeList } from "@/hooks/employee-hooks/get-employee-list";
import { X } from "@phosphor-icons/react";
import FallbackLoader from "../fallback-loader/loader";
import EmployeeAssignRole from "./assign-role";
import { AssignedEmployeePayLoad } from "@/models/employee";
import { useEmployeeContext } from "@/contexts/employee-context";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { useAssignEmployee } from "@/hooks/employee-hooks/use-assign-employee";
import { useTranslation } from "react-i18next";
import { EmployeeListType, FilterPayloadForEmployee } from "@/constants/employee";
import EmployeeAssignTable from "./employee-assign-table";
import { useGetEmployeeListCount } from "@/hooks/employee-hooks/get-employee-count";
import { useRouter, useSearchParams } from "next/navigation";

interface EmployeeAssignDialogProps {
    open: boolean
    close: () => void
    reFetchEmployeeList?: () => void
    firstName?: string
    lastName?: string
    email?: string
    empId?: string
}

export function EmployeeAssignDialog({ close, open, reFetchEmployeeList, firstName, lastName, email, empId }: EmployeeAssignDialogProps): React.JSX.Element {
    const [activeStep, setActiveStep] = React.useState<number>(0);
    const { employees, loading, fetchEmployeeList } = useGetEmployeeList(EmployeeListType?.Unassigned);
    const { employeesCount, fetchEmployeeListCount } = useGetEmployeeListCount(EmployeeListType?.Unassigned);
    const { assignedEmployee, selectedRole, setAssignedEmployee, setSelectedRole } = useEmployeeContext();
    const { selectedBCId } = useBusinessCenter();
    const { isAssigned, reFetch, loading: assignLoading } = useAssignEmployee();
    const { t } = useTranslation();
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [page, setPage] = useState(0);
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams?.toString());
    const router = useRouter();

    const clearEmployeeFilters = () => {
        params.delete('empId');
        params.delete('firstName');
        params.delete('lastName');
        params.delete('email');
        router.push(`?${params.toString()}`);
    };
            
    useEffect(()=>{
        clearEmployeeFilters();
    },[]);

    useEffect(() => {
        const requestBody = {
            employeeId: empId ?? '',
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            email: email ?? '',
        }
        const payLoad = FilterPayloadForEmployee.BindForm(requestBody);
        fetchEmployeeList(rowsPerPage, payLoad);
        fetchEmployeeListCount(payLoad);
    }, [email, empId, firstName, lastName, rowsPerPage]);

    const handlePageChange = (event: unknown, newPage: number) => {
        const requestBody = {
            employeeId: empId ?? '',
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            email: email ?? '',
        }
        const payLoad = FilterPayloadForEmployee.BindForm(requestBody);
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

    const handleBack = React.useCallback(() => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    }, [activeStep]);

    const closePopup = () => {
        setAssignedEmployee([]);
        setActiveStep(0);
        setSelectedRole(undefined);
        clearEmployeeFilters();
        close();
    }

    useEffect(() => {
        if (isAssigned) {
            closePopup();
            reFetchEmployeeList?.();
        }
    }, [isAssigned]);

    const steps = React.useMemo(() => [
        {
            label: t('Employee:select_employee'),
            content: <EmployeeAssignTable
                employees={employees}
                loading={loading}
                filters={{ firstName, lastName, email, empId }}
                employeesCount={employeesCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                fetchEmployeeList={fetchEmployeeList}
            />
        },
        {
            label: t('Employee:select_role'),
            content: <EmployeeAssignRole />
        }
    ], [employees, loading, firstName, lastName, email, empId, employeesCount, page, rowsPerPage, handlePageChange, handleRowsPerPageChange, fetchEmployeeList]);

    const handleNext = React.useCallback(() => {
        if (activeStep < steps?.length - 1) {
            setActiveStep((prev) => prev + 1);
        } else {
            const requiredPayLoadData = {
                assignedEmployee: assignedEmployee,
                selectedRole: selectedRole,
                selectedBCId: selectedBCId
            }
            const assignedEmployeePayload = AssignedEmployeePayLoad.formDta(requiredPayLoadData);
            reFetch(assignedEmployeePayload);
        }
    }, [activeStep, assignedEmployee, reFetch, selectedBCId, selectedRole, steps]);

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    close();
                }
            }}
            maxWidth="md"
            fullWidth
            disableEscapeKeyDown={false}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" px={3} pt={2}>
                <DialogTitle sx={{ p: 0 }}>{t('Employee:unassigned_employees')}</DialogTitle>
                <IconButton onClick={() => closePopup()}>
                    <X size={24} />
                </IconButton>
            </Box>
            <DialogContent>
                <DialogContentText component="div">
                    {
                        (loading || assignLoading) && <FallbackLoader />
                    }
                    <Stepper orientation="horizontal" activeStep={activeStep}>
                        {steps?.map((step) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            return (
                                <Step key={step?.label} {...stepProps}>
                                    <StepLabel {...labelProps}>{step?.label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>

                    <Box>
                        {steps[activeStep]?.content}
                    </Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={activeStep === 0} variant="outlined" sx={{ minWidth: 80 }} onClick={handleBack}>
                    {t('common:back')}
                </Button>
                <Button
                    variant="contained"
                    sx={{ minWidth: 80 }}
                    onClick={handleNext}
                    disabled={
                        (assignedEmployee?.length === 0 && activeStep === 0) ||
                        (activeStep === steps?.length - 1 && selectedRole === undefined)
                    }
                >
                    {activeStep === steps?.length - 1 ? "Submit" : "Next"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}