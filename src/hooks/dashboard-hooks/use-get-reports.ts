import { useBusinessCenter } from '@/contexts/businesscenter-context';
import { getBcOverview } from '@/lib/api/dashboard.service';
import { useCallback, useEffect, useState } from "react"

export const useGetReports = (reportType: string) => {
  const [reports, SetReports] = useState<string | undefined>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {selectedBCId} = useBusinessCenter();
  const getReportsUrl = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if(!selectedBCId) return;
      const response = await getBcOverview(reportType, Number(selectedBCId));
      if (response.success) {
        // SetReports(response?.url ? response?.url : undefined);
        SetReports(response?.url || "");

      } else {
        SetReports("");
        setError(response?.message ? response?.message : '');
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  },[selectedBCId])

  useEffect(() => {
    getReportsUrl();
  }, [getReportsUrl]);





  return { getReportsUrl, error, loading, reports };
}