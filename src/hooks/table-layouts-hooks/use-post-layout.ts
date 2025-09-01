'use client'

import { TableBinder } from "@/constants/table-layouts";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { createLayout } from "@/lib/api/table-layout.service";
import { UseCreateTable } from "@/types/table-layout";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useCreateTables = (): UseCreateTable => {
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedBCId } = useBusinessCenter();

  const createTables = useCallback(async (layoutId: number, tables: TableBinder[]): Promise<void> => {
    setLoading(true);
     setMessage('');
    try {
      const response = await createLayout(layoutId, tables, Number(selectedBCId));
      if (response.success) {
        setMessage(response?.message);
        toast.success(response?.message);
      } else {
        setError(response?.message ?? '');
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [selectedBCId]);

  useEffect(() => {
    setMessage('')
  },[selectedBCId])

  return { createTables, error, message, loading };
}
