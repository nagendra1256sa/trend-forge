import { Adapter } from "./adapter";


export interface TaxRate {
  id: number;
  location: number;
  rateType: number;
  metricType: number;
  rate: number;
  status: number;
}

export interface UserDetails {
  displayName: string;
}

export interface TaxRuleList {
  id: number;
  name: string;
  code: string;
  effectiveDate: string;
  expiryDate: string;
  description: string;
  status: number;
  createdAt: string;
  lastUpdatedAt: string;
  taxRuleCreatedUserDetails: UserDetails;
  taxRuleUpdatedUserDetails: UserDetails | null;
  taxRates: TaxRate[];
}

export class TaxRuleListAdapter implements Adapter<TaxRuleList> {
  adapt(data: any): TaxRuleList {
    return {
      id: data.ID,
      name: data.Name,
      code: data.Code,
      effectiveDate: data.EffectiveDate,
      expiryDate: data.ExpiryDate,
      description: data.Description,
      status: data.Status,
      createdAt: data.CreatedAt,
      lastUpdatedAt: data.LastUpdatedAt,
      taxRuleCreatedUserDetails: {
        displayName: data.TaxRuleCreatedUserDetails?.DisplayName || '',
      },
      taxRuleUpdatedUserDetails: data.TaxRuleUpdatedUserDetails ? {
        displayName: data.TaxRuleUpdatedUserDetails.DisplayName
      } : null,
      taxRates: (data.TaxRates || []).map((rate: any) => ({
        id: rate.ID,
        location: rate.Location,
        rateType: rate.RateType,
        metricType: rate.MetricType,
        rate: rate.Rate,
        status: rate.Status
      }))
    };
  }
}