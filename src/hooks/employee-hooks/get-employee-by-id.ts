import { getEmployeeByID } from "@/lib/api/employee.service";
import { Employee } from "@/models/employee";
import { useEffect, useState } from "react";


interface UseEmployeeDetailsReturn {
  employeeDetailsByID: Employee | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEmployeeDetails = (
  id: number
): UseEmployeeDetailsReturn => {
  const [employeeDetailsByID, setEmployeeDetailsById] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmployeeByID("R", id);
      if (response.success && response.data) {
        setEmployeeDetailsById(response.data);
      } else {
        setError(response.message || "Something went wrong");
      }
    } catch (error: any) {
      setError(error?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEmployee();
  }, [id]);

  return { employeeDetailsByID, loading, error, refetch: fetchEmployee };
};
