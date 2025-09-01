import { ExportEmployeeBinder } from "@/constants/employee";
import { exportEmployee } from "@/lib/api/employee.service";
import { InactivateEmployeeResponse } from "@/types/employee";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useExportEmployees() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [message, setMessage] = useState<string>();
    const { t } = useTranslation();

    const exportEmployees = async (payload: ExportEmployeeBinder) => {
        try {
            setLoading(true);
            setError(undefined);
            const response: InactivateEmployeeResponse = await exportEmployee(
                payload
            );

            if (response?.success) {
                setMessage(response?.message);
            } else {
                toast.error(t('common:common_error_message'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('common:common_error_message'));
        } finally {
            setLoading(false);
        }
    }

    return { exportEmployees, loading, error, message };
}