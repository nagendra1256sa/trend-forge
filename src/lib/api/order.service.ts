import { Check, CheckAdapter } from "@/models/order.model";
import { axiosInstances } from "./networkinstances";
import {  FilterPayload } from "@/types/order.constants";

export class CheckResponse {
  success!: boolean;
  checks?: Check[];
  message?: string;
}

export class CheckDetailResponse {
  success!: boolean;
  data?: Check;
  message?: string;
}

export const OrderList = async (params: FilterPayload): Promise<CheckResponse> => {
  try {
    const response = await axiosInstances.post('public/v1/cart/list', params);

    if (response?.status === 200) {
      const data = response?.data?.results;

      if (Array.isArray(data)) {
        const checks = data?.map((check: any) => {
           return new CheckAdapter().adapt(check);
        })

        return {
          success: true,
          checks
        };
      } else {
        return {
          success: false,
          message: 'Unexpected data format received from server.'
        };
      }

    } else {
      return {
        success: false,
        message: `Server responded with status ${response?.status ?? 'unknown'}.`
      };
    }

  } catch (error: any) {
    console.error("Network or server error while fetching order list:", error);
    let message = 'An unknown error occurred.';
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    return {
      success: false,
      message
    };
  }
};

export const OrderDetail = async(id: number): Promise<CheckDetailResponse> => {
  try {
    const response = await axiosInstances.get(`cart/${id}`);    
    return response?.status === 200 ? {
        success: true,
        data: new CheckAdapter()?.adapt(response?.data)
      } : {
        success: false,
        message: `Server responded with status ${response?.status ?? 'unknown'}.`
      };

  } catch (error: any) {
    console.error("Network or server error while fetching order details:", error);
    let message = 'An unknown error occurred.';
    if (error?.response?.data?.message) {
      message = error?.response?.data?.message;
    } else if (error?.message) {
      message = error?.message;
    }

    return {
      success: false,
      message
    }
  }
}
