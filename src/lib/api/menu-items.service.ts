import { GetMenuItemByIdResponse, MenuItemResponse } from "@/types/menu";
import { axiosInstances } from "./networkinstances"
import { BcMenuItemAdapter } from "@/models/menu-item.model";

export const getMenuDetails =async (bcId: number): Promise<MenuItemResponse> => {
  try {
    const response = await axiosInstances.get(`bc-products/bc-id/${bcId}`);
    return response?.status === 200 ? {
         success: true,
         menuDetails: response?.data?.data ? ( response?.data?.data as any[]).map((item) => new BcMenuItemAdapter().adapt(item)) : []  
        } : {
           success: false,
        };
  } catch(error: any) {
       let message;
        if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  };
}
export const getMenuItemByID =async (MenuId: number): Promise<GetMenuItemByIdResponse> => {
  try {
    const response = await axiosInstances.get(`bc-products/${MenuId}`);
    return response?.status === 200 ? {
         success: true,
         menuDetailsID: response?.data?.data ?  new BcMenuItemAdapter().adapt(response?.data?.data) : undefined
        } : {
           success: false,
        };
  } catch(error: any) {
       let message;
        if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  };
}

export const updateMenuItem =async (menuDetails: any,activeProductID: number): Promise<GetMenuItemByIdResponse> => {
  try {
    const response = await axiosInstances.put(`bc-products/id/${activeProductID}`,menuDetails);
    return response?.status === 200 && response?.data?.status=== true? {
         success: true,
         menuDetailsID: response?.data?.data ?  new BcMenuItemAdapter().adapt(response?.data?.data): undefined ,
        } : {
           success: false,
        };
  } catch(error: any) {
       let message;
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
}