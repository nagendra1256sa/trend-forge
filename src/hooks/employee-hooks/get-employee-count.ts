import { EmployeeFilters } from "@/components/employee/employee.filters";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { getEmployeeListCount } from "@/lib/api/employee.service";
import { useGetEmployeListCountResponse } from "@/types/employee";
import { useCallback, useState } from "react"



export const useGetEmployeeListCount = (pageType: string):useGetEmployeListCountResponse  => {
  const [employeesCount, setEmployeesCount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {selectedBCId} = useBusinessCenter();
  const fetchEmployeeListCount = useCallback(
    async (filters?: EmployeeFilters): Promise<void> => {
      setLoading(true);
      if(!selectedBCId) return;
      setEmployeesCount(0);
      try {
        const response = await getEmployeeListCount(Number(selectedBCId), filters, pageType);
        if (response.success) {
          setEmployeesCount(response?.count ?? 0);
        } else {
          setError(response?.message ? response?.message : '');
        }
      } catch (error: any) {
        setError(error?.message || String(error));
      } finally {
        setLoading(false);
      }
    },
    [selectedBCId]
  );

   return {employeesCount, error, loading, fetchEmployeeListCount};

} 
