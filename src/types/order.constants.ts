
export enum ChecksListContext {
  UNCLOSED_CHECKS = "unClosedChecks",
  BUSINESS_CENTER = "business_center",
  TENDER_MEDIA = "tender_media",
  BULK_ACTION_SUMMARY = "bulkActionSummary",
  ALL_CHECKS = "checks",
  BC_CHECKS = "bc_checks",
  PICKUP_CHECKS = "pickup_checks",
}

export enum BulkActionSummaryContext {
  CHECKS = "checks",
  DEVICES = "devices",
}


export const DisplayGroupedChecks = {
  [ChecksListContext.UNCLOSED_CHECKS]: true,
  [ChecksListContext.BULK_ACTION_SUMMARY]: true,
};

export const FiltersInCheckList = {
  [ChecksListContext.UNCLOSED_CHECKS]: true,
  [ChecksListContext.ALL_CHECKS]: true,
  [ChecksListContext.BC_CHECKS]: true,
};

export const ChecksListDisplayColumns = {
  [ChecksListContext.UNCLOSED_CHECKS]: [
    "select",
    "check",
    "checkValue",
    "time",
    "action",
  ],
  [ChecksListContext.BUSINESS_CENTER]: [
    "check",
    "date",
    "checkValue",
    "paymenttype",
  ],
  [ChecksListContext.TENDER_MEDIA]: [
    "businesscenter",
    "check",
    "date",
    "checkValue",
  ],
  [ChecksListContext.BULK_ACTION_SUMMARY]: [
    "check",
    "checkValue",
    "time",
    "errorReason",
  ],
  [ChecksListContext.ALL_CHECKS]: [
    "check",
    "customer",
    "owner",
    "orderSource",
    "paymenttype",
    "status",
    "date",
  ],
  [ChecksListContext.BC_CHECKS]: [
    "check",
    "customer",
    "owner",
    "paymenttype",
    "orderType",
    "external_source",
    "status",
    "businessDay",
    "date",
  ],
  [ChecksListContext.PICKUP_CHECKS]: [
    "check",
    "customer",
    "owner",
    "orderSource",
    "paymenttype",
    "status",
    "date",
  ],
};

export const CheckStatus = {
  1: "Open",
  2: "Serviced",
  3: "Paid",
  4: "Cancelled",
  5: "Refund",
};

export const orderTypeStatus = {
  1: "Active",
  2: "Inactive"
}

export const PaymentStatus = {
  0: "Failed",
  1: "Paid",
  2: "Unpaid",
}

export enum CheckSummaryConstants {
  DISCOUNT = "discount",
  TAX = "tax",
  AUTO_GRATUITY = "auto_gratuity",
  MANUAL_GRATUITY = "manual_gratuity",
  GRATUITY = "gratuity",
  SUBTOTAL = "sub_total",
  GRANDTOTAL = "grand_total",
}

export class Filter {
  FilterBy!: string;
  Value!: string[] | number[] | { formDate: string; toDate: string } | string;
}

const formatDateOnly = (dateString: string): string =>
  new Date(dateString).toISOString().split("T")[0];

export class FilterPayload {
  Filters: Filter[] = [];


  static BindForm(body: {
    status?: string[] | number[];
    source?: string[] | number[];
    orderType?: number[];
    startDate?: string;
    endDate?: string;
    checkId?: string;
  }): FilterPayload {
    const payload = new FilterPayload();
    const filters: Filter[] = [];

    // const formatDateOnly = (dateString: string): string =>
    //   new Date(dateString).toISOString().split("T")[0];

    // Bind status
    if (Array.isArray(body.status) && body?.status?.length) {
      filters.push({
        FilterBy: "Status",
        Value: body.status.map(String),
      });
    }

    // Bind source
    if (Array.isArray(body.source) && body?.source?.length) {
      filters.push({
        FilterBy: "Source",
        Value: body.source.map(Number),
      });
    }

    // Bind order type
    if (Array.isArray(body.orderType) && body?.orderType?.length) {
      filters.push({
        FilterBy: "Order",
        Value: body?.orderType?.map(Number),
      });
    }


    // Bind date range (format to "YYYY-MM-DD")
    if (body.startDate) {
      filters.push({
        FilterBy: "Date",
        Value: {
          formDate: formatDateOnly(body.startDate),
          toDate: body.endDate
            ? formatDateOnly(body.endDate)
            : "1969-12-31"
        },
      });
    }

    if (body?.checkId) {
      filters.push({
        FilterBy: "CheckId",
        Value: body?.checkId,
      });
    }

    payload.Filters = filters;
    return payload;
  }
}

export const sourceOptions: { key: string; value: string }[] = [
  { key: "4", value: "Chefgaa Order" },
  { key: "1", value: "Waiter App" },
];


