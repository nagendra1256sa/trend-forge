import { useEffect, useState } from "react";
import { TaxRulesResponseData } from "@/models/tax-rule.model";
import { fetchTaxRuleByBcId, fetchTaxRules } from "@/lib/api/tax-rules.service";
import { TaxRuleList } from "@/models/tax-rule-list.model";
import { TaxRulesResponse, TaxRulesResponseByBcId } from "@/types/tax-rule";

interface UseTaxRuleByBcIdReturn {
  taxData: TaxRulesResponseData | null;
  isLoading: boolean;
  error?: string | null;
  refetch?: () => void;
}
interface UseTaxRuleReturn {
  taxData: TaxRuleList []| null;
  isLoading: boolean;
  error?: string | null;
  refetch?: () => void;
}
export const useTaxRuleByBcId = (menuID: number): UseTaxRuleByBcIdReturn => {
  const [data, setData] = useState<TaxRulesResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getTaxRuleByBcId = async () => {
    setIsLoading(true);
    setError(null);

    const response : TaxRulesResponseByBcId = await fetchTaxRuleByBcId(menuID);

    if (response?.success) {
      setData(response?.data || null);
    } else {
      setError(response?.message || "Failed to fetch tax rules.");
      setData(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (menuID) {
      getTaxRuleByBcId();
    }
  }, [menuID]);

  return {
    taxData:data,
    isLoading,
    error,
    refetch: getTaxRuleByBcId,
  };
};

export const useTaxRule = (): UseTaxRuleReturn => {
  const [data, setData] = useState<TaxRuleList [] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getTaxRule = async () => {
    setIsLoading(true);
    setError(null);

    const response : TaxRulesResponse = await fetchTaxRules();

    if (response?.success) {
      setData(response?.data || null);
    } else {
      setError(response?.message || "Failed to fetch tax rules.");
      setData(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
      getTaxRule();
  }, []);

  return {
    taxData:data,
    isLoading,
    error,
    refetch: getTaxRule,
  };
};
