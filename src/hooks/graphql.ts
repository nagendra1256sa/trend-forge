import { getGratuity, getGratuityByID } from "@/lib/api/gratuity.service";
import { GratuityView } from "@/models/gratuity.model";
import { GratuityGraphQlResponse } from "@/types/gratuity";
import { useCallback, useEffect, useState } from "react";

export function useGetGraphQlData(id: number) {
  const [gratuityViewData, setGratuityData] = useState<GratuityView | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGratuityViewData = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getGratuityByID('R', id);
      if (response?.success && response?.data) {
        setGratuityData(response?.data);
      } else {
        setGratuityData(null);
        setError(response?.message ? response?.message : '');
      };
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGratuityViewData();
  }, [id]);

  return { gratuityViewData, loading, error };
}
export function useGetGratuityData() {
  const [gratuityViewData, setGratuityData] = useState<GratuityView[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGratuityViewData = useCallback(async () => {
    setLoading(true);
    try {
      const response: GratuityGraphQlResponse = await getGratuity('R');
      if (response.success && response.data) {
        setGratuityData(response.data);
        setError(null);
      } else {
        setGratuityData(null);
        setError(response.message || 'Failed to fetch gratuity data');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGratuityViewData();
  }, [fetchGratuityViewData]);

  return {
    gratuityViewData,
    loading,
    error,
    refetch: fetchGratuityViewData,
  };
}

