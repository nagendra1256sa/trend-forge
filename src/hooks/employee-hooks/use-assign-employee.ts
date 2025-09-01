import { assignEmployeeToNodeRef } from "@/lib/api/employee.service";
import { AssignedEmployeePayLoad } from "@/models/employee";
import { AssignEmployeeResponse } from "@/types/employee";
import {useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useAssignEmployee() {
    const[isAssigned, setIsAssigned] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {t} = useTranslation();

    const assignEmployee = useCallback(async (payLoad: AssignedEmployeePayLoad) => {
        try {
            setLoading(true);
            setError(null);
            setIsAssigned(false);
            const response: AssignEmployeeResponse = await assignEmployeeToNodeRef(payLoad);
            if(response?.success) {
                setIsAssigned(true);
                toast.success(t('Employee:employee_assigned_successfully'));
            } else {
                setIsAssigned(false);
                if(response?.message) {
                    setError(response?.message);
                } else {
                    toast.error(t('common:common_error_message'));
                }
            }
        } catch (error) {
            setError((error as Error).message);
            toast.error(t('common:common_error_message'));
        } finally {
            setLoading(false);
        }
    }, []);

    const reFetch = useCallback((payLoad: AssignedEmployeePayLoad) => {
        assignEmployee(payLoad);
    }, [assignEmployee]);

    return {isAssigned, loading, error, reFetch};
}

