import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { getReasons } from "@/lib/api/reasons.service";
import { Reason } from "@/models/reasons";
import { getReasonsHookTypes } from "@/types/reason";
import { useCallback, useEffect, useState } from "react"



export const useGetReasons = (): getReasonsHookTypes => {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {selectedBCId} = useBusinessCenter();
  const fetchRoles = useCallback(async(): Promise<void> => {
    setLoading(true);
    if(!selectedBCId)
      return 
      try{
        const response = await getReasons(Number(selectedBCId));
        if(response.success) {
            setReasons(response?.reasons ?? []);
        } else {
            setError(response?.message? response?.message : '');
        }
      } catch(error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
   },[selectedBCId])

  useEffect((): void=> {
     fetchRoles();
  },[selectedBCId]);

  const reFetch = useCallback(() => {
    fetchRoles();
  }, [fetchRoles]);

   return {reasons, error, loading, reFetch};

} 
