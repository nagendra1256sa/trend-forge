// import { axiosInstances } from "./networkinstances"
import type { DasboardResponse } from "@/types/dashboard";
import { axiosInstances } from "./networkinstances";
import { apiUrlPaths } from "./api.paths";

export const getBcOverview = async (reportType: string, bcId:number): Promise<DasboardResponse> => {
  try {
    const response =await axiosInstances.get(apiUrlPaths?.dashboard?.getReports,{
        params: {
            "report_type": reportType
        },
        headers: {
          "business_center":bcId
        }
    });
    return response?.status === 200 ? {
             success: true,
             url: response?.data?.url ? response?.data?.url : ""
        } : {
            success : false,
        };
  } catch(error: any) {
   let message;
        if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    }

    return {
      success: false,
      message
    };
  }
}