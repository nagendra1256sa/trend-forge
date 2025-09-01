import { getReasonType, GetReasonTypeResponse } from "@/lib/api/reasons.service";
import { ReasonTypes } from "@/models/reasons";
import { useCallback, useEffect, useState } from "react";

export function useReasonType() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reasonType, setReasonType] = useState<ReasonTypes[]>();

    const fetchReasonType = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response: GetReasonTypeResponse = await getReasonType();
            if (response?.success && response?.reasonsType) {
                setReasonType(response?.reasonsType);
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchReasonType();
    }, [fetchReasonType]);

    const refetch = useCallback(() => {
        fetchReasonType();
    }, [fetchReasonType]);

    return { reasonType, error, loading, refetch };

}