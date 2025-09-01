
import { Adapter } from "./adapter";
import { Employee } from "./employee";

export enum MenuItemsApiErrors {
  BUSINESS_CENTER_ACTIVE = 'business_center_active'
}

export class MenuItem {
  id!: number;
  sku?: string;
  label?: string;
  displayName?: string;
  image?: string;
  description?: string;
  productType?: number;
  productTypeLabel?: string;
  mandatory?: number;
  creator?: string;
  updator?: string;
  createdAt?: number;
  updatedAt?: string;
  creatorDetail?: Employee;
  isAlcoholic?: number;
  ingredients?: string;
  expirationDate?: string;
  instructions?: string;
  cookingTime?: string;
  declarationAllergens?: string;
  basePrice?: number;
  sellingPrice?: number;
  quantity?: string;
  location?: string;
  synonyms?: string;
  status?: number;
  rentBinNo?: number;
  courseMark?: number;
  mainCategory?: number;
  subCategory?: number;
  categoryLevel2?: number;
  primaryCategory?: Category;
  secondaryCategory?: Category;
  tertiaryCategory?: Category;
  employeeDisplayName?: string;
  guestDisplayName?: string;
  modifierOnly?: boolean;
  subdepartmentId?: number;
  measurementId?: number;
  measurementUnit?: MeasurementUnit;
  threshold?: number;
  stock?: number;
  updatedBy?: string;
}


export class Category {
  id!: number;
  name?: string;
  status?: number;
}


export class CategoryAdapter implements Adapter<Category> {
  adapt(item: any): Category {
    const category = new Category();
    category.id = item?.id;
    category.name = item?.name;
    category.status = item?.status;
    return category;
  }
}

export class MeasurementUnit {
  id!: number;
  measurement?: string;
  shortForm?: string;
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
}

export class MeasurementUnitAdapter implements Adapter<MeasurementUnit> {
  adapt(data: any): MeasurementUnit {
    const obj = new MeasurementUnit();
    if (data.id) obj.id = data?.id;
    if (data.measurement) obj.measurement = data?.measurement;
    if (data.short_form) obj.shortForm = data?.short_form;
    if (data.createdAt) obj.createdAt = data?.createdAt;
    if (data.createdBy) obj.createdBy = data?.createdBy;
    if (data.updatedAt) obj.updatedAt = data?.updatedAt;
    return obj;
  }
}


export class BcMenuItemAdapter implements Adapter<MenuItem> {
  adapt(item: any): MenuItem {
    const obj = new MenuItem();
    const creatorDet = new Employee();
    obj.id = item?.ID ? item?.ID : null;
    obj.sku = item?.SKU;
    obj.label = item?.Label;
    obj.image = item?.Image;
    obj.description = item?.Description;
    obj.creator = item?.Creator;
    obj.updator = item?.Updator;
    obj.createdAt = item?.CreatedAt * 1000;
    obj.updatedAt = item?.UpdatedAt;
    obj.productType = item?.ProductType;
    obj.status = item?.Status;
    if (item?.ProductType >= 0) {
      obj.productTypeLabel = item?.ProductType == 1 ? "Condiment" : "Regular";
    }

    obj.mandatory = item?.Mandatory;
    if (item?.UsersNew) {
      const Detail = item?.UsersNew;
      creatorDet.title = Detail?.Title ? Detail?.Title : "";
      creatorDet.first_name = Detail?.FirstName ? Detail?.FirstName : "";
      creatorDet.last_name = Detail?.LastName ? Detail?.LastName : "";
      obj.creatorDetail = creatorDet;
    };

    if (item?.UsersNew) {
      const Detail = item?.UsersNew;
      obj.updatedBy = Detail?.DisplayName ? Detail?.DisplayName : "";
    }

    if (item?.BcProductDetail) {
      const Detail = item?.BcProductDetail;
      obj.ingredients = Detail?.Ingredients ? Detail?.Ingredients : null;
      obj.instructions = Detail?.Instructions ? Detail?.Instructions : null;
      obj.cookingTime = Detail?.CookingTime ? Detail?.CookingTime : null;
      obj.declarationAllergens = Detail?.DeclarationAllergens
        ? Detail.DeclarationAllergens
        : null;
      obj.rentBinNo = Detail?.RentBinNo ? Detail?.RentBinNo : null;
      obj.courseMark = Detail.CourseMark ? Detail?.CourseMark : null;
    };

    if (item?.AdministrativeCategory) {
      const Detail = item?.AdministrativeCategory
      obj.primaryCategory = Detail?.PrimaryCategory?.name;
      obj.secondaryCategory = Detail?.SecondaryCategory?.name;
    };



    obj.basePrice = item?.BasePrice ? item?.BasePrice : null;
    if (item.SellingPrice == 0) {
      obj.sellingPrice = item?.SellingPrice;
    } else {
      obj.sellingPrice = item?.SellingPrice ? item?.SellingPrice : null;
    }
    obj.quantity = item.Quantity ? item.Quantity : null;
    obj.location = item.Location ? item.Location : null;

    if (item.BcProductPrice) {
      const Detail = item?.BcProductPrice;
      obj.basePrice = Detail?.BasePrice;
      obj.sellingPrice = Detail?.SellingPrice;
      obj.quantity = Detail?.Quantity ? Detail?.Quantity : null;
      obj.location = Detail?.Location ? Detail?.Location : null;
    }

    if (item.BcProductSynonym) {
      const Detail = item?.BcProductSynonym;
      obj.synonyms = Detail?.Synonyms ? Detail?.Synonyms : null;
    }

    return obj;
  }
}

