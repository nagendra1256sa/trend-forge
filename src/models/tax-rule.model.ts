import { Adapter } from "./adapter";

export interface TaxRate {
  id: number;
  loc: number;
  type: number;
  metric: number;
  rate: number;
  status: number;
}

export interface TaxRuleCreatedUserDetails {
  name: string;
}

export interface CategoryTaxRule {
  id: number;
  name: string;
  code: string;
  start: string;
  end: string;
  desc: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdBy: TaxRuleCreatedUserDetails;
  updatedBy: TaxRuleCreatedUserDetails | null;
  rates: TaxRate[];
  assignedBy: string;
  assignedAt: string;
}

export interface TaxRulesResponseData {
  isOverridden: boolean;
  category: string;
  categoryTaxRules: CategoryTaxRule[];
  productRules: any[];
}

export class TaxRuleAdapter implements Adapter<TaxRulesResponseData> {
  adapt(data: any): TaxRulesResponseData {
    try {
      return {
        isOverridden: data?.IsOverridden ?? false,
        category: data?.Category ?? "",
        categoryTaxRules: (data?.CategoryTaxRules ?? []).map((tax: any) => ({
          id: tax.ID,
          name: tax.Name,
          code: tax.Code,
          start: tax.EffectiveDate,
          end: tax.ExpiryDate,
          desc: tax.Description,
          status: tax.Status,
          createdAt: tax.CreatedAt,
          updatedAt: tax.LastUpdatedAt,
          createdBy: {
            name: tax.TaxRuleCreatedUserDetails?.DisplayName ?? "",
          },
          updatedBy: tax.TaxRuleUpdatedUserDetails
            ? { name: tax.TaxRuleUpdatedUserDetails.DisplayName ?? "" }
            : null,
          rates: (tax.TaxRates ?? []).map((rate: any) => ({
            id: rate.ID,
            loc: rate.Location,
            type: rate.RateType,
            metric: rate.MetricType,
            rate: rate.Rate,
            status: rate.Status,
          })),
          assignedBy: tax.AssignedBy,
          assignedAt: tax.AssignedAt,
        })),
        productRules: data?.ProductTaxRules ?? [],
      };
    } catch (error) {
      console.error("TaxAdapter error:", error);
      throw new Error("Failed to adapt TaxData");
    }
  }
}

export class TaxRuleAdapterByTaxId implements Adapter<CategoryTaxRule> {
  adapt(data: any): CategoryTaxRule {
    try {
      const tax = data?.CategoryTaxRules;

      return {
        id: tax?.ID,
        name: tax?.Name,
        code: tax?.Code,
        start: tax?.EffectiveDate,
        end: tax?.ExpiryDate,
        desc: tax?.Description,
        status: tax?.Status,
        createdAt: tax?.CreatedAt,
        updatedAt: tax?.LastUpdatedAt,
        createdBy: {
          name: tax?.TaxRuleCreatedUserDetails?.DisplayName ?? "",
        },
        updatedBy: tax?.TaxRuleUpdatedUserDetails
          ? { name: tax?.TaxRuleUpdatedUserDetails?.DisplayName ?? "" }
          : null,
        rates: (tax?.TaxRates ?? [])?.map((rate: any) => ({
          id: rate?.ID,
          loc: rate?.Location,
          type: rate?.RateType,
          metric: rate?.MetricType,
          rate: rate?.Rate,
          status: rate?.Status,
        })),
        assignedBy: tax?.AssignedBy,
        assignedAt: tax?.AssignedAt,
      };
    } catch (error) {
      console.error("TaxAdapter error:", error);
      throw new Error("Failed to adapt TaxData");
    }
  }
}



export class Location {
  id!: number;
  name!: string;
  status?: number;
  description?: string;
  creator?: number;
  createdAt?: Date;
  updator?: null;
  lastUpdatedAt?: null;
  currency?: number;
}

export class LocationAdapter implements Adapter<Location> {
  adapt(item: any) {
    const location = new Location();
    if (item) {
      location.id = item?.ID;
      location.name = item?.Name;
      location.status = item?.Status;
      location.description = item?.Description;
      location.createdAt = item?.CreatedAt;
      location.creator = item?.Creator;
      location.status = item?.Status;
      location.updator = item?.Updator;

    }
    return location;
  }
}
