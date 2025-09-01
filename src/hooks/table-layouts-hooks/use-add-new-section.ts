import { NewSectionBinder } from "@/constants/table-layouts";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { addNewSection } from "@/lib/api/table-layout.service";
import { AddNewSectionResponse } from "@/types/table-layout";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAddNewSection() {
    const [newSection, setSection] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { selectedBCId } = useBusinessCenter();

    const addNewSectionHandler = useCallback(async (payload: NewSectionBinder) => {
        try {
            setLoading(true);
            setError(null);
            setSection(false);
            const response: AddNewSectionResponse = await addNewSection(payload, Number(selectedBCId));
            if (response?.success) {
                setSection(response?.success);
                toast.success('New section added successfully');
            } else {
                setSection(false);
                setError(response?.message ? response?.message : '');
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [selectedBCId]);

    useEffect(() => {
        setSection(false);
        setError(null);
    }, [selectedBCId])

    const reFetch = useCallback((payload: NewSectionBinder) => {
        addNewSectionHandler(payload);
    }, [addNewSectionHandler]);

    return { newSection, error, loading, reFetch };



}