"use client";

import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { OrderTypeService } from "@/lib/api/order-types.service";
import { OrderType } from "@/models/order-type.model";
import { OrderTypeResponse } from "@/types/order-type";
import { useCallback, useEffect, useState } from "react";

export function useOrderTypeList() {
    const [orderTypeList, setOrderTypeList] = useState<OrderType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { selectedBCId } = useBusinessCenter();

    const fetchOrderTypeList = useCallback(async () => {
        if (!selectedBCId) return;

        try {
            setLoading(true);
            setError(null);

            const response: OrderTypeResponse = await OrderTypeService.getOrderTypes(Number(selectedBCId));

            if (response?.success && response?.orderType) {
                setOrderTypeList(response.orderType);
            } else {
                setOrderTypeList([]);
                setError("Failed to fetch order types.");
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }, [selectedBCId]);

    useEffect(() => {
        void fetchOrderTypeList();
    }, [fetchOrderTypeList]);

    const reFetch = useCallback(() => {
        void fetchOrderTypeList();
    }, [fetchOrderTypeList]);

    return {
        orderTypeList,
        error,
        loading,
        reFetch
    };
}
