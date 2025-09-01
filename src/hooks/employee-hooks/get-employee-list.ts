import { EmployeeFilter } from "@/constants/employee";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { getEmployeeList } from "@/lib/api/employee.service";
import { BCEmployees } from "@/models/employee";
import { useGetEmployeListHookResponse } from "@/types/employee";
import { useState } from "react"



export const useGetEmployeeList = (pageState?: string): useGetEmployeListHookResponse => {
  const [employees, setEmployees] = useState<BCEmployees>(new BCEmployees());
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {selectedBCId} = useBusinessCenter();
  const fetchEmployeeList = async (limit: number, filters?: EmployeeFilter[], after?: string | null, before?: string | null): Promise<void> => {
    if (!selectedBCId) return;
      setLoading(true);
      try {
        const response = await getEmployeeList(limit, Number(selectedBCId), filters, after, before, pageState);
        if (response.success) {
          setEmployees(response?.employees ? response?.employees : new BCEmployees());
        } else {
          setError(response?.message ? response?.message : '');
        }
      } catch (error: any) {
        setError(error?.message || String(error));
      } finally {
        setLoading(false);
      }
    }

   return {employees, error, loading, fetchEmployeeList};

} 
