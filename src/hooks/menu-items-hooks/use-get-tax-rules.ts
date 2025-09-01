import { getTaxRuleByTaxId } from "@/lib/api/tax-rules.service";
import { CategoryTaxRule } from "@/models/tax-rule.model";
import { TaxRulesResponseByBcId } from "@/types/tax-rule";
import React, { useCallback, useState } from "react"

export const useGetTaxRuleDetails = (taxId: number) => {
    const [taxRuleDetails, SetTaxRuleDetails] = useState<CategoryTaxRule | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
      const fetchTaxRuleDetails = async(): Promise<void> => {
        setLoading(true);
          try{
            const response : TaxRulesResponseByBcId = await getTaxRuleByTaxId(Number(taxId));
            if(response.success) {
                SetTaxRuleDetails(response?.data ? response?.data: null);
            } else {
                SetTaxRuleDetails(null);
                setError(response?.message? response?.message : '');
            }
          } catch(error: any) {
            setError(error);
          } finally {
            setLoading(false);
          }
       }
       
       React.useEffect(() => {
         fetchTaxRuleDetails();
       },[taxId]);
    
        const reFetch = useCallback(() => {
             fetchTaxRuleDetails();
          }, []);
    
       return {taxRuleDetails, error, loading, reFetch};
}