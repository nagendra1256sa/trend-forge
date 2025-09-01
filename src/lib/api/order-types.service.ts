import { OrderTypeAdapter } from "@/models/order-type.model";
import { axiosInstances } from "./networkinstances";
import { OrderTypeResponse } from "@/types/order-type";

export const OrderTypeService = {

    async getOrderTypes(bcId:number): Promise<OrderTypeResponse> {

        try {
            const response = await axiosInstances.get('order-type',
                {
                    // TODO: nee to change BC id as dynamic
                    headers: {
                        'business_center': bcId,
                        'pos_client_code': 'waiter_app',
                    },
                }
            );
            const data = response?.data?.data;
            if (response?.status === 200 && Array.isArray(data)) {
                const adapter = new OrderTypeAdapter();
                return {
                    success: true,
                    orderType: data?.map((res: any) => {
                        return adapter.adapt(res)
                    })
                }

            } else {
                return {
                    success: false,
                    orderType: []
                }
            }

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error?.message : "Unknown error",
            }

        }
    }
}