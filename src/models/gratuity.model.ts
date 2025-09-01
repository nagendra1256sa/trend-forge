import { Adapter } from "./adapter";


export interface GratuityRule {
  id: number;
  name: string;
  rate: number;
  type: string;
  code: string;
  status: number;
  creator: number;
  createdAt: string;
  updator: number | null;
  updatedAt: string;
  assignedBy: string;
  assignedAt: string;
}

export interface GratuityData {
  isOverridden: boolean;
  category: string;
  categoryGratuity: GratuityRule[];
  product: any[];
}

export class GratuityAdapter implements Adapter<GratuityData> {
  adapt(data: any): GratuityData {
    try {
      return {
        isOverridden: data?.IsOverridden ?? false,
        category: data?.Category ?? "",
        categoryGratuity: (data?.CategoryGratuities ?? []).map((gratuity: any) => ({
          id: gratuity.ID,
          name: gratuity.Name,
          rate: gratuity.Rate,
          type: gratuity.MetricType,
          code: gratuity.Code,
          status: gratuity.Status,
          creator: gratuity.Creator,
          createdAt: gratuity.CreatedAt,
          updator: gratuity.Updator,
          updatedAt: gratuity.UpdatedAt,
          assignedBy: gratuity.AssignedBy,
          assignedAt: gratuity.AssignedAt,
        })),
        product: data?.ProductGratuities ?? [],
      };
    } catch (error) {
      console.error("GratuityAdapter error:", error);
      throw new Error("Failed to adapt GratuityData");
    }
  }
};

export type GratuityView = {
  id: number;
  name: string;
  code: string;
  rate: string;
  metricType: string;
  metricRate: string;
  status: number;
  statusText: string;
};

export class GratuityGraphqlAdapter implements Adapter<GratuityView> {
  adapt(item: any): GratuityView {
    // console.log(item)
    let responseObj: GratuityView = {
      id: 0,
      name: "",
      code: "",
      rate: "0",
      metricRate: "",
      metricType: "",
      status: 1,
      statusText: "",
    };
    if (item) {
      if (item.ID) responseObj.id = item?.ID;
      if (item.Name) responseObj.name = item?.Name?.trim();
      if (item.Code) responseObj.code = item?.Code?.trim();
      if (item.Rate && item.MetricType) {
        responseObj.metricType = item?.MetricType;
        responseObj.metricRate = item?.Rate;
        responseObj.rate = item?.Rate;
      }
      if (item.Status) {
        responseObj.status = item?.Status;
        responseObj.statusText = item?.Status == 1 ? "Active" : "Inactive";
      }
    } else {
      responseObj = item;
    }
    return responseObj;
  }
}
