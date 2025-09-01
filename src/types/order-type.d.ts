export interface OrderTypeResponse {
  success: boolean;
  message?: string;
  orderType?: OrderType[];
}

export interface OrderTypeTableProps {
  rows: OrderType[];
}