import { BusinessCenterAdapter } from "@/models/business-centers.models";

import { BusinessCenterResponse } from "@/types/businesscenters";

import { axiosInstances } from "./networkinstances";

const adapter = new BusinessCenterAdapter();

export const fetchBusinessCenterNode = async (id: number): Promise<BusinessCenterResponse> => {
  try {
    const response = await axiosInstances.get(`/organisation-hierarchy?fetchfrom=${id}`);
    if (response?.status === 200) {
        const adapted = response?.data?.children?.map((item: any) => adapter.adapt(item));
      return {success: true, message: "Api Called Successfully", data: adapted};
    } else {
      return {success: false,message: "Api not Called Successfully",};
    }
  } catch (error: any) {
    let message;
    if (error?.response?.data?.message) {
         message = error?.response?.data?.message;
    } else if (error?.message) {
        message = error?.message;
    } return {success: false, message,};
  }
};
