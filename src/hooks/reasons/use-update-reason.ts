import { ReasonError } from "@/constants/error";
import { updateReasonById, UpdateReasonResponse } from "@/lib/api/reasons.service";
import { ReasonInputs } from "@/models/reasons";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useUpdateReason() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReasonUpdated, setIsReasonUpdated] = useState<boolean>(false);
    const { t } = useTranslation();

    const updateReason = useCallback(async (id: number, formData: ReasonInputs) => {
        if (!id || !formData) return;
        try {
            setLoading(true);
            setError(null);
            setIsReasonUpdated(false);
            const response: UpdateReasonResponse = await updateReasonById(id, formData);
            if (response?.success) {
                setIsReasonUpdated(true);
                toast.error(t('Reasons:reason_updated_successfully'));
            } else {
                setError(response?.message || "Something went wrong");
                switch (response?.message) {
                    case ReasonError.error_reason_already_exists: {
                        toast.error(t('Reasons:reason_already_exists'));
                        break;
                    }
                    case ReasonError.error_unable_to_update_reason: {
                        toast.error(t('Reasons:unable_to_update_reason'));
                        break;
                    }
                    default: {
                        toast.error(t('common:common_error_message'));

                        break;
                    }
                }
            }
        } catch (error) {
            setError((error as Error).message);

        } finally {
            setLoading(false);
        }

    }, [])

    return { updateReason,loading, isReasonUpdated, error };

}