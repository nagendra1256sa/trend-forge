
"use client";

import { getLocations } from "@/lib/api/tax-rules.service";
import { Location } from "@/models/tax-rule.model";
import { LocationsResponse } from "@/types/tax-rule";
import { useCallback, useEffect, useState } from "react";

export function useGetLocations() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response: LocationsResponse = await getLocations();
            if(response?.success) {
                setLocations(response?.locations ?? []);
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocations();
    }, []);

    return { locations, error, loading };
   
}