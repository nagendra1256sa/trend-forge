import { BulkRemoveEmployeeBinder } from "@/constants/employee";
import { bulkRemoveeEmployees } from "@/lib/api/employee.service";
import { InactivateEmployeeResponse } from "@/types/employee";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useBulkRemoveEmployees() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [isRemoved, setIsRemoved] = useState<boolean>();
    const {t} = useTranslation();

    const bulkRemoveEmployee = async (payload: BulkRemoveEmployeeBinder) => {
        try {
            setLoading(true);
            setIsRemoved(false);
            setError(undefined);
            const response: InactivateEmployeeResponse = await bulkRemoveeEmployees(
                payload
            );

            if (response?.success) {
                setIsRemoved(true);
                toast.success(t('Employee:employees_assigned_successfully'));
                setMessage(response?.message);
            } else {
                setIsRemoved(false);
                if (response?.message) {
                    setError(response?.message);
                }
                else{
                    toast.error(t('common:common_error_message'));
                }
            }
        } catch (error) {
            setIsRemoved(false);
            console.error(error);
            toast.error(t('common:common_error_message'));
        } finally {
            setLoading(false);
        }
    }

    return { bulkRemoveEmployee, loading, error, message, isRemoved };
}