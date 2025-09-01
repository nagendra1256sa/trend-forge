import { CheckDetailResponse, OrderDetail } from "@/lib/api/order.service";
import { Check } from "@/models/order.model";
import { useEffect, useRef, useCallback, useState } from "react";

export function useOrderDetail(orderId?: number) {
  const [orderDetail, setOrderDetail] = useState<Check>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedId = useRef<number | null>(null);

  const fetchOrderDetail = useCallback(async (id: number) => {
    if (!id || lastFetchedId?.current === id) return;

    try {
      setLoading(true);
      setError(null);
      const response: CheckDetailResponse = await OrderDetail(id);
      if (response?.success) {
        setOrderDetail(response.data);
        lastFetchedId.current = id;
      }
    } catch (error) {
      setError((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      void fetchOrderDetail(orderId);
    }
  }, [orderId, fetchOrderDetail]);

  const reFetch = useCallback((id: number) => {
    lastFetchedId.current = null;
    void fetchOrderDetail(id);
  }, [fetchOrderDetail]);

  return {
    orderDetail,
    loading,
    error,
    reFetch,
  };
}
