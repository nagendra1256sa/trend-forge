'use client'

import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { getSectionsLayouts } from "@/lib/api/table-layout.service";
import { SectionLayout } from "@/models/table-layout";
import { UseGetLayoutSections } from "@/types/table-layout";
import { useCallback, useEffect, useState } from "react";

export const useGetLayouts = (): UseGetLayoutSections => {
   const [layoutSections, setLayoutsSections] = useState<SectionLayout[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {selectedBCId} = useBusinessCenter()
    const fetchLayoutSections = useCallback(async(): Promise<void> => {
      if (!selectedBCId) return;
      setLoading(true);
        try{
          const response = await getSectionsLayouts(Number(selectedBCId));
          if(response.success) {
              setLayoutsSections(response?.layouts ? response?.layouts: []);
          } else {
              setLayoutsSections([]);
              setError(response?.message? response?.message : '');
          }
        } catch(error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
     },[selectedBCId])

    useEffect((): void=> {
       fetchLayoutSections();
    },[selectedBCId])
  
   const refetch = useCallback(() => {
  fetchLayoutSections();
}, [fetchLayoutSections]);

  
     return {layoutSections, error, loading, refetch, setLayoutsSections};
}