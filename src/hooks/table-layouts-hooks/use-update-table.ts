import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { updateTable } from "@/lib/api/table-layout.service";
import { UpdateTablePayLoad } from "@/models/table-layout.model";
import { updateTableResponse } from "@/types/table-layout";
import {  useCallback, useState } from "react";

export function useUpdateTableById() {

    const [isTableUpdate, setUpdateTable] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
     const { selectedBCId } = useBusinessCenter();

    const updateTableLayout = useCallback(async(layoutId: number, payLoad:UpdateTablePayLoad, tableId: number) => {
        try {
            setLoading(true);
            setError(null);
            setUpdateTable(false);
            const response: updateTableResponse = await updateTable(layoutId,payLoad, tableId, Number(selectedBCId));
            if(response?.success) {
                setUpdateTable(response?.success);
            } else {
                setUpdateTable(false);
                setError(response?.message? response?.message : '');
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [selectedBCId]);

    const reFetch = useCallback((layoutId: number, payLoad:UpdateTablePayLoad, tableId: number) => {
        updateTableLayout(layoutId,payLoad,tableId);
    }, [updateTableLayout]);
    
    return {isTableUpdate, error, loading, reFetch};
}