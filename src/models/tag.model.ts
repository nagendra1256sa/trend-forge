import { Adapter } from "./adapter";

// Helper functions to replace node:util
const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
const isNull = (val: any): val is null => val === null;
const isNumber = (val: any): val is number => typeof val === 'number' && !Number.isNaN(val);
const isString = (val: any): val is string => typeof val === 'string';

export class TagCategory {
  title!: string;
  key!: string;
}

export class Tag {
  id!: BigInteger;
  title?: string;
  category?: TagCategory;
  key?: string;
  canRemove: boolean = false;
  showCategory: boolean = true;
  isActive: boolean = false;

  createdAt?: Date;
  creatorID?: BigInteger;
  creatorName?: string;
  isCreatorActive?: boolean = true;

  lastUpdatedAt?: Date;
  lastUpdatedByName?: string;
  lastUpdatedID?: BigInteger;
  isUpdatedUserActive?: boolean = true;

  syncInProgress = false;

  public get updatedAt(): Date {
    if (this.lastUpdatedAt) {
      return this.lastUpdatedAt;
    }
    if (this.createdAt) {
      return this.createdAt;
    }
    return new Date(0); 
  }

  public get updatedBy(): string {
    if (this.lastUpdatedByName) {
      return this.lastUpdatedByName;
    }
    return this.creatorName || '';
  }

  public get isLastUpdatedUserActive(): boolean {
    if (this.lastUpdatedByName) {
      return this.isUpdatedUserActive || false;
    }
    return this.isCreatorActive || false;
  }
}

export class TagAdapter implements Adapter<Tag> {
  getNameFromItem(item: any) {
    if (isNull(item)) {
      return null;
    }
    const displayName = item?.DisplayName;
    const firstName = item?.FirstName;
    const lastName = item?.LastName;
    let creatorName = null;

    if (isString(displayName) && displayName.length > 0) {
      creatorName = displayName;
    } else {
      if (isString(firstName) && firstName.length > 0) {
        creatorName = firstName;
      }
      if (isString(lastName) && lastName.length > 0) {
        creatorName = creatorName && creatorName.length > 0
          ? creatorName + " " + lastName
          : lastName;
      }
    }

    return creatorName;
  }

  adapt(item: any): Tag {
    const tagModelObject: Tag = new Tag();

    try {
      tagModelObject.id = isString(item.id) ? Number.parseInt(item.id) : item.id;
      tagModelObject.title = isString(item.name) ? item.name : null;

      const categoryString = isString(item.categoryTitle) ? item.categoryTitle : null;
      const categoryKey = isString(item.categoryKey) ? item.categoryKey : null;
      if (categoryString != null) {
        const tagCategoryObject = new TagCategory();
        tagCategoryObject.title = categoryString;
        tagCategoryObject.key = categoryKey;

        tagModelObject.category = tagCategoryObject;
      }

      tagModelObject.key = isString(item.resourceKey) ? item.resourceKey : null;

      if (Object.prototype.hasOwnProperty.call(item, "canRemove") && !isNull(item.canRemove)) {
        tagModelObject.canRemove = isBoolean(item.canRemove)
          ? item.canRemove
          : isNumber(item.canRemove)
          ? item.canRemove === 1
          : item.canRemove;
      }

      if (Object.prototype.hasOwnProperty.call(item, "isActive") && !isNull(item.isActive)) {
        tagModelObject.isActive = isNumber(item.isActive)
          ? item.isActive === 1
          : isBoolean(item.isActive)
          ? item.isActive
          : false;
      }

      tagModelObject.createdAt = isNumber(item.createdAt)
        ? new Date(item.createdAt * 1000)
        : isString(item.createdAt)
        ? new Date(Number.parseInt(item.createdAt) * 1000)
        : undefined;

      tagModelObject.creatorID = isString(item.createdBy)
        ? Number.parseInt(item.createdBy)
        : item.createdBy;

      if (item.createdUserDetails != null) {
        tagModelObject.creatorName = this.getNameFromItem(item.createdUserDetails) ?? undefined;


        if (!isNull(item.createdUserDetails.Status)) {
          const userStatus = item.createdUserDetails.Status;
          tagModelObject.isCreatorActive = isNumber(userStatus)
            ? userStatus === 1
            : isBoolean(userStatus)
            ? userStatus
            : false;
        }
      }

      tagModelObject.lastUpdatedAt = isNumber(item.updatedAt)
        ? new Date(item.updatedAt * 1000)
        : isString(item.updatedAt)
        ? new Date(Number.parseInt(item.updatedAt) * 1000)
        : undefined;

      tagModelObject.lastUpdatedID = isString(item.updatedBy)
        ? Number.parseInt(item.updatedBy)
        : item.updatedBy;

      if (item.updatedUserDetails != null) {
        tagModelObject.lastUpdatedByName = this.getNameFromItem(item.updatedUserDetails) ?? undefined;

        if (!isNull(item.updatedUserDetails.Status)) {
          const userStatus = item.updatedUserDetails.Status;
          tagModelObject.isUpdatedUserActive = isNumber(userStatus)
            ? userStatus === 1
            : isBoolean(userStatus)
            ? userStatus
            : false;
        }
      }
    } catch {
      // Handle adaptation error if needed
    }

    return tagModelObject;
  }
}
