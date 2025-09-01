'use client'
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { getLayoutTables } from "@/lib/api/table-layout.service";
import { TableDetails } from "@/models/table-layout";
import { UseGetTables } from "@/types/table-layout";
import { useCallback, useState } from "react";

export const useGetTablesDetails = (): UseGetTables => {

  const [tables, setTables] = useState<TableDetails[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedBCId } = useBusinessCenter();


  const fetchTableDetails = useCallback(async (layoutId: number): Promise<void> => {
    if (!selectedBCId) return;
    setLoading(true);
    try {
      const response = await getLayoutTables(layoutId, Number(selectedBCId));
      if (response.success) {
        setTables(response?.tables ? response?.tables : []);
      } else {
        setTables([]);
        setError(response?.message ? response?.message : '');
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [selectedBCId]);


  const refetch = useCallback((layoutId: number) => {
    fetchTableDetails(layoutId);
  }, [fetchTableDetails]);

  return { tables, error, loading, refetch, setTables };
}