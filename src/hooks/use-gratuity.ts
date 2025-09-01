import { getGratuitiesByBcId } from "@/lib/api/gratuity.service";
import { GratuityData } from "@/models/gratuity.model";
import { GratuityResponse } from "@/types/gratuity";
import { useEffect, useState } from "react";


interface UseTaxRuleReturn {
  gratuityData: GratuityData | null;
  isLoading: boolean;
  error?: string | null;
  refetch?: () => void;
}

export const useGratuity = (menuID: number): UseTaxRuleReturn => {
  const [data, setData] = useState<GratuityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGratuities = async () => {
    setIsLoading(true);
    setError(null);

    const response :GratuityResponse = await getGratuitiesByBcId(menuID);

    if (response?.success) {
      setData(response?.data || null);
    } else {
      setError(response?.message || "Failed to fetch Gratuity.");
      setData(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (menuID) {
      fetchGratuities();
    }
  }, [menuID]);

  return {
    gratuityData:data,
    isLoading,
    error,
    refetch: fetchGratuities,
  };
};
