"use client"

import { CheckResponse, OrderList } from "@/lib/api/order.service";
import { Check } from "@/models/order.model";
import { FilterPayload } from "@/types/order.constants";
import { useCallback, useState } from "react";

export function useOrderList() {
  const [orderList, setOrderList] = useState<Check[] | undefined>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [payload, setPayload] = useState<FilterPayload>({ Filters: [] });

  const fetchOrderList = useCallback(async (params: FilterPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response: CheckResponse = await OrderList(params);
      if (response?.success) {
        setOrderList(response.checks);
      }
    } catch (error_) {
      setError((error_ as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   void fetchOrderList(payload);
  // }, [fetchOrderList, payload]);

  const reFetch = useCallback((newPayload: FilterPayload) => {
    fetchOrderList(newPayload);
  }, []);

  return { orderList, error, loading, reFetch };
}

