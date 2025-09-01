import { ReasonError } from "@/constants/error";
import { createReason, CreateReasonResponse } from "@/lib/api/reasons.service";
import { ReasonInputs } from "@/models/reasons";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function useCreateReason() {
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [isReasonCreated, setIsReasonCreated] = useState<boolean>(false);
   const {t} = useTranslation();

   const createNewReason = useCallback(async (formData: ReasonInputs) => {
      try {
        setLoading(true);
        setError(null);
        setIsReasonCreated(false);
        const response: CreateReasonResponse = await createReason(formData);
        if (response?.success) {
          setIsReasonCreated(true);
          toast.success(t('Reasons:reason_created_successfully'));
        } else {
          setError(response?.message || "Something went wrong");

          switch (response?.message) {
            case ReasonError.error_reason_already_exists: {
                toast.error(t('Reasons:reason_already_exists'));
              break;
            }
            case ReasonError.error_unable_to_create_reason: {
                toast.error(t('Reasons:unable_to_create_reason'));
              break;
            }
            default: {
              toast.error(t('common:common_error_message'));
             
              break;
            }
          }
        
        }
      } catch (error) {
        console.log(error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
   }, []);

   return { createNewReason, error, loading, isReasonCreated };
}