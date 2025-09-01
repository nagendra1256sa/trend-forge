import { orderTypeStatus } from "@/types/order.constants";
import { Adapter } from "./adapter";

export class availableChannelsType {
  code!: string;
  title!: string;
  status?: string
}


export class availableChannelsAdapter implements Adapter<availableChannelsType> {
  adapt(item: any): availableChannelsType {
    const order = new availableChannelsType();
    try {
      order.code = item?.code;
      order.title = item?.title;
      order.status = orderTypeStatus?.[item?.status as keyof typeof orderTypeStatus];
    } catch (error) {
      console.log(error);
    }
    return order;
  }
}


export class OrderType {
  id!: number;
  cloverId!: string;
  label!: string;
  taxable?: boolean;
  isDefault?: boolean;
  filterCategories?: boolean;
  isHidden?: boolean;
  fee?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  maxRadius?: number | null;
  avgOrderTime?: number;
  hoursAvailable?: string;
  customerIdMethod!: string | null;
  isDeleted?: boolean;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  availableChannels?: availableChannelsType[]
  creatorName?: string;
}


export class OrderTypeAdapter implements Adapter<OrderType> {
  adapt(item: any): OrderType {
    const order = new OrderType();
    try {
      order.id = item?.id;
      order.cloverId = item?.cloverId;
      order.label = item?.label || '';
      order.taxable = item?.taxable;
      order.isDefault = item?.isDefault;
      order.filterCategories = item?.filterCategories;
      order.isHidden = item?.isHidden;
      order.fee = item?.fee;
      order.minOrderAmount = item?.minOrderAmount;
      order.maxOrderAmount = item?.maxOrderAmount;
      order.avgOrderTime = item?.avgOrderTime || null;
      order.hoursAvailable = item?.hoursAvailable;
      order.customerIdMethod = item?.customerIdMethod || null;
      order.isDeleted = item?.isDeleted;
      order.createdBy = item?.createdBy;
      order.updatedBy = item?.updatedBy;
      order.createdAt = item?.createdAt;
      order.updatedAt = item?.updatedAt;
      order.creatorName = item?.creatorName;
      order.availableChannels = item?.availableChannels ? item?.availableChannels.map((item: any) => new availableChannelsAdapter().adapt(item)) : [];
    } catch (error) {
      console.error('OrderTypeAdapter Error:', error);
    }
    return order;
  }
}