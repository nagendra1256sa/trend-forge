import { BusinessCenterNode } from "@/models/business-centers.models";

export interface BusinessCenterResponse {
  success: boolean;
  message: string;
  data?: BusinessCenterNode[];
}