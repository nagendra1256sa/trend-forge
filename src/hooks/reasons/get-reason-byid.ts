import { getReasonById } from "@/lib/api/reasons.service";
import { Reason } from "@/models/reasons";
import { getReasonByIdHookTypes } from "@/types/reason";
import { useCallback, useEffect, useState } from "react";

export function useGetReasonById(id: number):getReasonByIdHookTypes {
    const [reason, setReason] = useState<Reason | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReasons = useCallback(async () => {
         if(!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getReasonById(id);
            if (response.success && response.data) {
                setReason(response.data);
            } else {
                setError(response.message || "Something went wrong");
            }
        } catch (error: any) {
            setError(error.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    },[id]); 

    useEffect(() => {
        void fetchReasons();
    }, [fetchReasons, id]);

    return { reason, loading, error, fetchReasons };
 
}