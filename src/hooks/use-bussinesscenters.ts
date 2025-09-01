import { fetchBusinessCenterNode } from "@/lib/api/businesscenters.service";
import { BusinessCenterNode } from "@/models/business-centers.models";
import { BusinessCenterResponse } from "@/types/businesscenters";
import { useState, useCallback, useEffect } from "react";

interface UseBusinessCenterNodeReturn {
  data: BusinessCenterNode[];
  loading: boolean;
  error: string | null;
}

export const useBusinessCenterNode = (): UseBusinessCenterNodeReturn => {
  const [data, setData] = useState<BusinessCenterNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userDetails = localStorage?.getItem('userDetails');
      const parsedUser = userDetails ? JSON.parse(userDetails) : null;
      const nodeRef = parsedUser?.NodeRef;

      if (!nodeRef) {
        setError("NodeRef not found in user details");
        setData([]);
        return;
      }

      const result: BusinessCenterResponse = await fetchBusinessCenterNode(nodeRef);
      if (result?.success && result?.data) {
        setData(result?.data);
      } else {
        setError(result?.message || "Failed to fetch business center data");
        setData([]);
      }
    } catch (error: any) {
      setError(error?.message || "Unknown error occurred");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
  };
};