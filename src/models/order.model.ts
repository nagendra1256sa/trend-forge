import { CheckStatus, CheckSummaryConstants, PaymentStatus } from "@/types/order.constants";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Adapter } from "./adapter";


dayjs.extend(relativeTime);


export class UserDetails {
  id!: number;
  status?: number;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export class UserDetailsAdapter implements Adapter<UserDetails> {
  adapt(data: any): UserDetails {
    const userDetails = new UserDetails();

    try {
      userDetails.id = data?.ID;
      userDetails.status = data?.Status;
      userDetails.firstName = data?.FirstName;
      userDetails.lastName = data?.LastName;
      userDetails.displayName = data?.DisplayName;

      if (
        !userDetails.displayName &&
        (userDetails.firstName || userDetails.lastName)
      ) {
        userDetails.displayName =
          userDetails.firstName && userDetails.lastName
            ? `${userDetails.firstName} ${userDetails.lastName}`
            : userDetails.firstName ?? userDetails.lastName;
      }

      return userDetails;
    } catch (error) {
      console.error("Error adapting UserDetails:", error);
      throw error;
    }
  }
}


export class PosClient {
  id!: number;
  code?: string;
  title?: string;
  isActive?: boolean;
  bcBusinessStatus?: boolean;
  statusSubmissionInProgress?: boolean;
}

export class PosClientAdapter implements Adapter<PosClient> {
  adapt(item: any): PosClient {
    if (!item) return new PosClient();

    const posClientObject = new PosClient();

    try {
      posClientObject.id = item.Id ? Number.parseInt(item?.Id) : item?.Id;
      posClientObject.code = item?.Code ? item?.Code : null;
      posClientObject.title = item?.Title ? item?.Title : null;

      const isActiveItem = item?.IsActive;
      if (isActiveItem) {
        posClientObject.isActive = Number(isActiveItem)
          ? isActiveItem == 1
            ? true
            : false
          : isActiveItem
            ? isActiveItem
            : false;
      }
    } catch {
      // console.log(
      //   "Unable to convert item to pos client. Error description " +
      //     error.description
      // );
    }

    return posClientObject;
  }
}

export class Check {
  id!: string;
  checkNumber!: number;
  businessCenterId!: string;
  owner!: number;
  guest?: number;
  ownerDetails?: UserDetails;
  device?: string;
  parent?: number;
  taxExempted?: number;
  gratuityExempted?: number;
  status?: string;
  reason?: string;
  tableNumber?: string;
  creatorId?: number;
  createdAt?: string;
  lastUpdatedBy?: number;
  lastUpdatedAt?: string;
  checkSummary?: CheckSummary[];
  checkItems?: CheckItem[];
  checkPayments?: CheckPayment[];
  SplitedChecks?: [];
  externalSource?: string;
  OrderDetail?: OrderType;
  total?: number;
  guests?: UserDetails[];
  discount?: number;
  deliveryInstructions?: string;
  orderType?: number;
  orderTypeName?: string;
  isChecked?: boolean = false;
  loaderStatus?: boolean;
  bussinessCenterName?: string;
  paymentType?: string;
  paymentTypeId?: number;
  date?: string;
  posClient?: PosClient;
  orderTypeObj?: OrderType;
  bussinessDay?: Date;
  orderValue?: number;

  private _isSelected: boolean = false;

  get isSelected(): boolean {
    return this._isSelected;
  }

  setIsSelected(status: boolean) {
    this._isSelected = status;
  }

  private _jobInProgress: boolean = true;

  get isJobInprogress(): boolean {
    return this._jobInProgress;
  }

  setJobInProgress(jobStatus: boolean) {
    this._jobInProgress = jobStatus;
  }
}

export class Discount {
  promotionName?: string;
  promoCode?: string;
  amount?: number;
  discountType?: number;
  promotionId?: number;
}

export class CheckItem {
  id!: number;
  cartId?: number;
  cartServiceId?: number;
  parent?: number;
  menuItemId?: string;
  name?: string;
  gratuity?: number;
  tax?: number;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  owner?: number;
  discountedPrice?: number;
  autoGratuity?: number;
  manualGratuity?: number;
  discount?: number;
  status?: number;
  reason?: string;
  creatorId?: number;
  createdAt?: number | string;
  lastUpdatedBy?: number;
  lastUpdatedAt?: number;
  SKU?: string;
  primaryCategoryId?: number;
  primaryCategoryName?: string;
  secondaryCategoryId?: number;
  secondaryCategoryName?: string;
  serviceOrder?: number;
  serviceStatus?: number;
  condiments?: CheckItemCondiment[];
  splittedChecks?: string[];
  cartPayments?: string[];
  discounts?: Discount[];
  price?: number;
  condimentsDisplay?: string;
  //isCustomizable: boolean;
  valid?: boolean = true;
}

export class CheckItemCondiment {
  id!: number;
  name?: string;
  outletModifierId?: string;
  status?: number;
  modifierId?: string;
  menuItemid?: number;
}

export class CheckSummary {
  key?: string;
  value?: number;
}

export class ResponceMsg {
  Status!: boolean;
  Msg?: string;
}

export class PaymentMethod {
  ID?: number;
  Name!: string;
  Type?: string;
  Description?: string;
  Status?: number;
  Reason?: number;
  ReasonType?: string | number;
  NodeRef?: number;
  Parent?: number;
  responseMsg?: ResponceMsg;

  updateFromForm(formData: any) {
    this.Name = formData?.Name;
    this.Type = formData?.Type;
    this.ReasonType = Number.parseInt(formData?.ReasonType);
    this.Reason = Number.parseInt(formData?.Reason);
    this.Description = formData?.Description;
    if (formData?.Status) {
      this.Status = formData?.Status;
    }
  }
}


export class PaymentMethodAdapter implements Adapter<PaymentMethod> {
  adapt(item: any): PaymentMethod {
    const obj = new PaymentMethod();

    obj.ID = item?.ID ? Number.parseInt(item.ID) : undefined;
    obj.Type = item?.Type;
    obj.Name = item?.Name;
    obj.Description = item?.Description;
    obj.Status = item?.Status;
    obj.Reason = item?.Reason;
    obj.ReasonType = item?.ReasonType?.toString();
    obj.NodeRef = item?.NodeRef;
    obj.Parent = item?.Parent;

    if (item?.ResponceMsg) {
      obj.responseMsg = item.ResponceMsg;
    }

    return obj;
  }
}


export class CheckPayment {
  id!: number;
  cartId?: number;
  paymentId?: number;
  amount?: number;
  status?: number;
  owner?: number;
  creatorId?: number;
  createdAt?: number;
  lastUpdatedBy?: number;
  lastUpdatedAt?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: string;
}

export class OrderType {
  id!: number;
  bcId!: number;
  externalId?: string;
  label?: string;
  key?: string;
  taxable?: boolean;
  isDefault?: boolean;
  filterCategories?: boolean;
  isHidden?: boolean;
  fee?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  maxRadius?: number;
  avgOrderTime?: number;
  hoursAvailable?: string;
  customerIdMethod?: string;
  isDeleted?: boolean;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date;
  allowedCategoryIds?: number[] | null;
}


export class CheckPaymentAdapter implements Adapter<CheckPayment> {
  adapt(item: any): CheckPayment {
    const cartPayment = new CheckPayment();

    try {
      cartPayment.id = item?.id;
      cartPayment.cartId = item?.cart_id;
      cartPayment.paymentId = item?.payment_id;
      cartPayment.amount = item?.amount;
      cartPayment.status = item?.status;
      cartPayment.owner = item?.owner;
      cartPayment.creatorId = item?.creator_id;
      cartPayment.paymentStatus = PaymentStatus?.[item?.payment_status as keyof typeof PaymentStatus];

      if (Object?.prototype?.hasOwnProperty?.call(item, "created_at")) {
        cartPayment.createdAt = item.created_at;
      }

      cartPayment.lastUpdatedBy = item?.last_updated_by;
      cartPayment.lastUpdatedAt = item?.last_updated_at;

      cartPayment.paymentMethod = item?.PaymentMethod
        ? new PaymentMethodAdapter().adapt(item.PaymentMethod)
        : new PaymentMethod();

    } catch (error) {
      console.error("Error adapting CheckPayment:", error);
    }

    return cartPayment;
  }
}


export class CheckSummaryAdapter implements Adapter<CheckSummary> {
  adapt(data: any) {
    const cartSummary = new CheckSummary();
    try {
      cartSummary.key = data.key ? data?.key : "";
      cartSummary.value = Object.hasOwn(data || {}, "value") ? data.value : null;
    } catch (error) {
      console.error("Error adapting CheckSummary:", error);
    }
    return cartSummary;
  }
}

export class OrderTypeAdapter implements Adapter<OrderType> {
  adapt(data: any): OrderType {
    const orderType = new OrderType();

    try {
      orderType.id = data?.id;
      orderType.bcId = data?.bc_id;
      orderType.externalId = data?.external_id;
      orderType.label = data?.label;
      orderType.key = data?.key;
      orderType.taxable = data?.taxable;
      orderType.isDefault = data?.is_default;
      orderType.filterCategories = data?.filter_categories;
      orderType.isHidden = data?.is_hidden;
      orderType.fee = data?.fee;
      orderType.minOrderAmount = data?.min_order_amount;
      orderType.maxOrderAmount = data?.max_order_amount;
      orderType.maxRadius = data?.max_radius;
      orderType.avgOrderTime = data?.avg_order_time;
      orderType.hoursAvailable = data?.hours_available;
      orderType.customerIdMethod = data?.customer_id_method;
      orderType.isDeleted = data?.is_deleted;
      orderType.createdBy = data?.created_by;
      orderType.createdAt = data?.created_at ? new Date(data.created_at) : undefined;
      orderType.updatedBy = data?.updated_by;
      orderType.updatedAt = data?.updated_at ? new Date(data.updated_at) : undefined;
      orderType.allowedCategoryIds = data?.allowed_category_ids;
    } catch (error) {
      console.error('OrderTypeAdapter error:', error);
    }

    return orderType;
  }
}


export class CheckAdapter implements Adapter<Check> {
  adapt(data: any): Check {
    const cart = new Check();

    try {
      if (data && Object?.prototype?.hasOwnProperty?.call(data, "content")) {
        data = data.content;
      }

      cart.id = data?.id;
      cart.status = CheckStatus?.[data?.status as keyof typeof CheckStatus] ?? CheckStatus[1];
      cart.checkNumber = data?.cart_no;
      cart.businessCenterId = data?.bc?.toString() ?? "";
      cart.owner = data?.owner;
      cart.guest = data?.guest;
      cart.device = data?.device ?? "";
      cart.parent = data?.parent;
      cart.taxExempted = data?.tax_exempted;
      cart.gratuityExempted = data?.gratuity_exempted;
      cart.reason = data?.reason ?? "";
      cart.tableNumber = data?.table_no ?? "";
      cart.creatorId = data?.creator_id;
      cart.createdAt = data?.created_at;
      cart.lastUpdatedBy = data?.last_updated_by;
      cart.lastUpdatedAt = data?.last_updated_at;
      cart.orderType = data?.order_type;
      cart.externalSource = data?.external_source;
      cart.bussinessDay = new Date(data?.current_business_day);
      cart.orderTypeObj = data?.OrderType
        ? new OrderTypeAdapter().adapt(data.OrderType)
        : new OrderType();

      cart.deliveryInstructions = data?.delivery_instructions ?? "";

      cart.checkSummary = data?.CartSummary?.length > 0
        ? data.CartSummary.map((summary: any) => new CheckSummaryAdapter().adapt(summary))
        : [];
      const disCountObj = (data?.CartSummary ?? []).find((item: CheckSummary) => item?.key === "discount");
      cart.discount = disCountObj?.value ?? 0;
      if (data && Object?.prototype?.hasOwnProperty?.call(data, "CartItems")
      ) {
        cart.checkItems = Array.isArray(data?.CartItems)
          ? data.CartItems.map((item: CheckItem) => new CheckItemAdapter().adapt(item))
          : [];
      }

      if (Array.isArray(cart.checkSummary)) {
        for (const summary of cart.checkSummary) {
          if (summary?.key === CheckSummaryConstants.GRANDTOTAL) {
            cart.total = summary.value;
          }
        }
      }

      if (Array.isArray(cart.checkSummary)) {
        let totalValue = 0;
        const totalValueArray = new Set(['tax', 'gratuity', 'sub_total'])
        for (const summary of cart.checkSummary) {
          if (summary.key && summary.value && totalValueArray.has(summary.key))
            totalValue = totalValue + summary.value
        }
        cart.orderValue = Number(totalValue.toFixed(3));
      }

      if (data && Object?.prototype?.hasOwnProperty?.call(data, "CartPayments")) {
        cart.checkPayments = Array.isArray(data?.CartPayments)
          ? data.CartPayments.map((payment: any) => new CheckPaymentAdapter().adapt(payment))
          : [];
      }

      if (data && Object?.prototype?.hasOwnProperty?.call(data, "SplitedChecks")) {
        cart.SplitedChecks = data?.SplitedChecks ?? [];
      }

      if (data && Object?.prototype?.hasOwnProperty?.call(data, "ownerDetails")) {
        cart.ownerDetails = data?.ownerDetails
          ? new UserDetailsAdapter().adapt(data.ownerDetails)
          : new UserDetails();
      }

      if (data && Object?.prototype?.hasOwnProperty?.call(data, "guests")) {
        cart.guests = Array.isArray(data?.guests)
          ? data.guests
            .filter(Boolean)
            .map((guest: any) => new UserDetailsAdapter().adapt(guest))
          : [];
      }

      if (data && Object?.prototype?.hasOwnProperty?.call(data, "POSClient")) {
        cart.posClient = data?.POSClient
          ? new PosClientAdapter().adapt(data.POSClient)
          : new PosClient();
      }

    } catch (error) {
      console.error("Error adapting Check:", error);
    }

    return cart;
  }

  getCheckItems(cartItems: any[]): CheckItem[] {
    return cartItems?.map((response) => new CheckItemAdapter().adapt(response)) ?? [];
  }
}


export class CheckItemAdapter implements Adapter<CheckItem> {
  adapt(data: any) {
    const cartItem = new CheckItem();

    try {
      cartItem.id = data?.id;
      cartItem.cartId = data?.cart_id;
      cartItem.cartServiceId = data?.cart_service_id;
      cartItem.parent = data?.parent;
      cartItem.menuItemId = data?.menu_item_id;
      cartItem.name = data?.menu_item_name;
      cartItem.gratuity = data?.gratuity;
      cartItem.tax = data?.tax;
      cartItem.quantity = data?.quantity;
      cartItem.price = data?.unit_price;
      cartItem.totalPrice = data?.total_price;
      cartItem.owner = data?.owner;
      cartItem.discountedPrice = data?.discounted_price;
      cartItem.autoGratuity = data?.auto_gratuity;
      cartItem.manualGratuity = data?.manual_gratuity ?? 0;
      cartItem.discount = data?.discount ?? 0;

      cartItem.discounts = data?.Discounts?.length
        ? data.Discounts.map((discount: any) => new DiscountAdapter().adapt(discount))
        : [];

      cartItem.status = data?.status;
      cartItem.reason = data?.reason ?? "";
      cartItem.creatorId = data?.creator_id;
      cartItem.createdAt = data?.created_at;
      cartItem.lastUpdatedBy = data?.last_updated_by;
      cartItem.lastUpdatedAt = data?.last_updated_at;
      cartItem.SKU = data?.sku ?? "";
      cartItem.primaryCategoryId = data?.primary_category_id;
      cartItem.primaryCategoryName = data?.primary_category_name ?? "";
      cartItem.secondaryCategoryId = data?.secondary_category_id;
      cartItem.secondaryCategoryName = data?.secondary_category_name ?? "";
      cartItem.serviceOrder = data?.service_order;
      cartItem.serviceStatus = data?.service_status;

      cartItem.condiments = data?.Condiments?.length
        ? this.getCondiments(data.Condiments)
        : [];

      cartItem.splittedChecks = data?.SplitedChecks?.length
        ? data.SplitedChecks
        : [];

      cartItem.cartPayments = data?.CheckPayments?.length
        ? data.CheckPayments
        : [];

      const tempCondimentsArr: string[] = [];
      for (const condiment of cartItem.condiments) {
        if (condiment?.name) {
          tempCondimentsArr.push(condiment.name);
        }
      }
      cartItem.condimentsDisplay = tempCondimentsArr.join(", ");

      return cartItem;
    } catch (error) {
      console.error("Error adapting CheckItem:", error);
      throw error;
    }
  }

  getCondiments(condiments: any[]) {
    return condiments.map((response) => new CondimentAdapter().adapt(response));
  }
}


export class CondimentAdapter implements Adapter<CheckItemCondiment> {
  adapt(data: any) {
    const condiment = new CheckItemCondiment();
    condiment.id = data?.id ? data?.id : null;
    condiment.name = data?.menu_item_name ? data?.menu_item_name : null;
    condiment.outletModifierId = data?.sku ? data?.sku : null;
    condiment.modifierId = data?.menu_item_id ? data?.menu_item_id : null;
    condiment.status = data?.status ? data?.status : null;
    return condiment;
  }
}

export class DiscountAdapter implements Adapter<Discount> {
  adapt(data: any): Discount {
    const discount = new Discount();
    discount.promotionId = data.promotion_id ? data.promotion_id : null;
    discount.discountType = data.discount_type ? data.discount_type : null;
    discount.amount = data.amount ? data.amount : null;
    discount.promoCode =
      data.Promotion && data.Promotion.promo_code
        ? data.Promotion.promo_code
        : null;
    discount.promotionName =
      data.Promotion && data.Promotion.name ? data.Promotion.name : null;
    return discount;
  }
}


export class WrapCartData {
  condimentIds?: string[];
  outletMenuItem?: string;
  quantity: number = 1;
  promoCode?: string;
  name?: string;
  cartItems: CheckItem[] = [];
  price: number = 0;
  discount: number = 0;
  isCustomizable: boolean = false;
  status?: number;
  itemCount: number = 1;

  static getCartWithCondiments(cart: Check): WrapCartData[] {
    const cartItems: WrapCartData[] = [];

    if (!cart?.checkItems?.length) return cartItems;

    for (const data of cart.checkItems) {
      if (data.status === 4) continue;

      const condimentIds = (data.condiments ?? [])
        .map((c) => c.outletModifierId)
        .filter((id): id is string => id !== undefined)
        .sort();

      const matchingItems = cartItems.filter(
        (item) => item.outletMenuItem === data.menuItemId
      );

      const existingItem = matchingItems.find((item) =>
        JSON.stringify(item.condimentIds?.slice().sort() ?? []) ===
        JSON.stringify(condimentIds)
      );

      if (existingItem) {
        existingItem.cartItems.push(data);
        existingItem.price += data?.price ?? 0;
        existingItem.quantity++;
      } else {
        const newItem = new WrapCartData();
        newItem.condimentIds = condimentIds;
        newItem.outletMenuItem = data.menuItemId;
        newItem.quantity = 1;
        newItem.price = data.price ?? 0;
        newItem.name = data.name;
        newItem.cartItems = [data];
        newItem.status = data.status;
        newItem.itemCount = 1;

        cartItems.push(newItem);
      }
    }

    return cartItems;
  }
}

export class ExportOrders {
  orderId?: number;
  customer?: string;
  assignedStaff?: string;
  paymentOptions?: string;
  orderType?: string;
  source?: string;
  status?: string;
  businessDay?: string;
  date?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  orderValue?: string;
  discount?: string;
  netPayable?: string;
  oderStatus?: string;
  static bindForm(data: any) {
    if (!data)
      return;
    const exportChecks = new ExportOrders();
    exportChecks.orderId = data?.checkNumber;
    exportChecks.date = dayjs(data?.createdAt).fromNow();
    exportChecks.orderType = data?.orderTypeObj?.label;
    exportChecks.source = data?.posClient?.title ? data?.posClient?.title : '-';
    exportChecks.customer = data?.guests?.length ? data?.guests[0]?.displayName : '-';
    exportChecks.oderStatus = data?.status ?? "-";
    exportChecks.paymentStatus = data?.checkPayments ? PaymentStatus?.[data?.checkPayments?.[0]?.paymentStatus as keyof typeof PaymentStatus] : "-";
    exportChecks.paymentMethod = data?.checkPayments &&
      data?.checkPayments?.length &&
      data?.checkPayments[data?.checkPayments?.length - 1]
        .paymentMethod &&
      data?.checkPayments[data?.checkPayments?.length - 1]
        .paymentMethod?.Name
      ? data?.checkPayments[data?.checkPayments?.length - 1]
        ?.paymentMethod?.Name
      : "-";
    exportChecks.orderValue = data?.orderValue ? `$${data.orderValue}` : '$0';

    exportChecks.discount = data?.discount ? `$${data.discount}` : '$0';
    exportChecks.netPayable = data?.total ? `$${data.total}` : '$0';
    exportChecks.assignedStaff = data?.ownerDetails?.firstName;



    // 
    // exportChecks.businessDay = dayjs(data?.bussinessDay)?.fromNow();

    return exportChecks;
  }

}