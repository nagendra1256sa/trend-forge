import { paths } from "@/paths"
import { axiosInstances } from "./networkinstances"
import { ReportsResponse } from "@/types/reports";


export const getReportsOverview = async (): Promise<ReportsResponse> => {
  try {
    const response =await axiosInstances.get(paths?.dashboard?.reportsOverview,{
        params: {
            "report_type": "item_sale_report"
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