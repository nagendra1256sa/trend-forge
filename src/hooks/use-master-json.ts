"use client";

import { commonService, MasterJsonResponse } from "@/lib/api/common.service";
import { useCallback, useEffect, useState } from "react";

export function useMasterJson(headers={}) {
    const [masterJson, setMasterJson] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchMasterJson = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response: MasterJsonResponse = await commonService.getMasterJson(headers);
            if(response?.success) {
                setMasterJson(response?.data);
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchMasterJson();
    }, [fetchMasterJson]);

    const reFetch = useCallback(() => {
        void fetchMasterJson();
    }, [fetchMasterJson]);

    return { masterJson, error, loading, reFetch };
   
}