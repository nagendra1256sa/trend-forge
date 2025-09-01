import { getRoles } from "@/lib/api/employee.service";
import { Role } from "@/models/role";
import { useEffect, useState } from "react"



export const useGetRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const fetchRoles = async(): Promise<void> => {
    setLoading(true);
      try{
        const response = await getRoles();
        if(response.success) {
            setRoles(response?.roles ? response?.roles : []);
        } else {
            setError(response?.message? response?.message : '');
        }
      } catch(error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
   }
  useEffect((): void=> {
     fetchRoles();
  },[]);

   return {roles, error, loading};

} 
