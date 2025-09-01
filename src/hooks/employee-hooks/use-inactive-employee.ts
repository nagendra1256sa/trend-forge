import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { inactivateEmployee } from "@/lib/api/employee.service";
import { Employee } from "@/models/employee";
import { InactivateEmployeeResponse } from "@/types/employee";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useToInActiveEmployee(employee?: Employee) {
    const [isEmployeeInactive, setEmployeesInactive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const [error, setError] = useState<string>();
    const {selectedBCId} = useBusinessCenter();

    const inactivate = useCallback(async ()=>{
        if(!employee || !selectedBCId) return;
        try {
            setEmployeesInactive(false);
            setLoading(true);
            setError(undefined);
            const response:InactivateEmployeeResponse = await inactivateEmployee(employee,Number(selectedBCId));
            if(response.success) {
                setEmployeesInactive(true);
                setMessage(response?.message);
                toast.success("Employee unassigned successfully");
            } else  {
                setError(response.message);
            }
            
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoading(false);
        }
    },[employee, selectedBCId])

     const reFetch = useCallback(() => {
        void inactivate();
    }, [inactivate]);

    return ({
        isEmployeeInactive,
        loading,
        error,
        message,
        reFetch
    })

}