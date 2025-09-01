

import { Adapter } from "./adapter";
import { TagAdapter } from "./tag.model";

export class Employee {
  id!: number;
  userid?: number;
  isHidden?: boolean;
  shipId?: number;
  voyageId?: number;
  title?: string;
  first_name?: string;
  last_name?: string;
  gender?: number;
  birth_date?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  preferred_language?: string;
  nationality?: number;
  passenger_num?: string;
  account?: number;
  employee_no?: string;
  display_name?: string;
  employee_type?: string;
  brand_id?: number;
  rfid?: string;
  guest_type?: number;
  cabin_no?: string;
  access_type?: number;
  status?: number;
  payroll_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_id?: string;
  platform_id?: string;
  pos_client_id?: string;
  creator_id?: number;
  created_by?: string;
  last_updated_by?: number;
  last_updated_at?: number;
  created_at?: Date;
  employee_code?: string;
  UserDisabilities?: any[];
  ResponceGql?: ResponceGql;

  UserRole?: UserRole;
  UserDetail?: UserDetail;
  UserImage?: UserImage;
  cursor?: string;
  Role?: Role[];
  Msg?: string;
  Status?: boolean;

  roleId?: number;
  folderName?: string;
  Name?: string;
  is_default?: number;
  NodeRef?: number;
  Parent?: number;
  userHealthCheck?: any;
  UserDeviceAssignment?: any;
  password?: string;
  user_id?: string;
  groups: any[] = [];
  group_titles?: string;
  is_super_user?: boolean;
  subsequent_folder_access?: boolean;

  hasActiveOTP(): boolean {
    return !!this.password;
  }
}


export class ResponceGql {
  Msg?: string;
  Status?: boolean;
}

export class UserRole {
  id!: number;
  user_id?: number;
  role_id?: number;
  status?: number;
  creator_id?: number;
  last_updated_by?: number;
  ip_address?: string;
  user_agent?: string;
  device_id?: string;
  platform_id?: string;
  pos_client_id?: string;
  created_at?: number;
  last_updated_at?: number;
  Role?: Role;
  creator?: Employee;
  last_updator?: Employee;
}

export class Role {
  ID!: number;
  Name?: string;
  Status?: number;
  IpAddress?: string;
  UserAgent?: string;
  PlatformId?: string;
  CreatorId?: number;
  CreatedAt?: number;
  LastUpdatedBy?: number;
  LastUpdatedAt?: number;
};

export class UserImage {
  id!: number;
  user_id?: number;
  image?: string;
  status?: number;
  creator_id?: number;
  last_updated_by?: number;
  ip_address?: string;
  user_agent?: string;
  device_id?: string;
  platform_id?: string;
  pos_client_id?: string;
  created_at?: number;
  last_updated_at?: number;
};

class UserDetail {
  id!: number;
  user_id?: number;
  line1?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country_id?: number;
  color?: string;
  booking_no?: string;
  billing_no?: string;
  ship_card_no?: string;
  status?: number;
  creator_id?: number;
  created_by?: string;
  last_updated_by?: string;
  ip_address?: string;
  user_agent?: string;
  device_id?: string;
  platform_id?: string;
  pos_client_id?: string;
  embarkation_date?: string;
  disembarkation_date?: string;
  created_at?: Date;
  last_updated_at?: Date;
  pier_status?: number;
  pier_checkin_by?: number;
  pier_checkin_at?: number;
  concierge_status?: number;
  concierge_checkin_by?: number;
  concierge_checkin_at?: number;
  group_id?: string;
};

export class EmployeeAdapter implements Adapter<Employee> {
  adapt(item: any): Employee {
    try {
      if (item && Object.prototype.hasOwnProperty.call(item, "node")) {
        const tempItem = item;
        item = tempItem?.node;
        item.cursor = tempItem?.cursor;
      }

      const obj = new Employee();
      if (item) {
        obj.id = item?.ID;
        obj.shipId = item?.Ship;
        obj.voyageId = Number.parseInt(item?.Voyage);
        obj.title = item?.Title;
        obj.first_name = item?.FirstName;
        obj.last_name = item?.LastName;
        obj.gender = item?.Gender;
        obj.birth_date = item?.BirthDate;
        obj.email = item?.Email;
        obj.employee_code = item?.EmployeeCode;
        obj.is_super_user = item?.IsSuperUser;
        // if(item.UserRole && item.UserRole.hasOwnProperty("Roles")) {
        //   obj.is_hidden = (item.UserRole.Roles && item.UserRole.Roles.IsHidden == 1 ? true : false);
        //   // obj.is_hidden = true;
        // } else {
        //   obj.is_hidden = false;
        // }
        // obj.is_hidden = (item.IsSuperUser == 1 ? true : false);

        obj.phone = item?.Phone;
        obj.mobile = item?.Mobile;
        obj.preferred_language = item?.PreferredLanguage;
        obj.nationality = item?.Nationality;
        obj.passenger_num = item?.PassengerNo;
        obj.account = item?.Account;
        obj.employee_no = item?.EmployeNo;
        obj.display_name = item?.DisplayName;
        obj.employee_type = item?.EmployeeType;
        obj.brand_id = item?.Brand;
        obj.rfid = item?.RfID;
        obj.guest_type = item?.GuestType;
        obj.cabin_no = item?.CabinNo;
        obj.access_type = item?.AccessType;
        obj.status = item?.Status;
        obj.payroll_id = item?.PayrollID;
        obj.ip_address = item?.IpAddress;
        obj.user_agent = item?.UserAgent;
        obj.device_id = item?.DeviceID;
        obj.platform_id = item?.PlatformID;
        obj.pos_client_id = item?.PosClient;
        obj.creator_id = item?.Creator;
        obj.created_at = item?.CreatedAt;
        obj.userHealthCheck = item?.UserHealthCheck
          ? item?.UserHealthCheck
          : null;
        obj.UserDeviceAssignment = item?.UserDeviceAssignment
          ? item?.UserDeviceAssignment?.DeviceId
          : null;

        if (item.ResponceMsg) {
          obj.ResponceGql = new ResponceGql();
          obj.ResponceGql.Msg = item?.ResponceMsg?.Msg
            ? item.ResponceMsg.Msg
            : "";
          obj.ResponceGql.Status = item?.ResponceMsg?.Status
            ? item?.ResponceMsg?.Status
            : false;
        }

        if (item.UpdatedByDetails) {
          obj.last_updated_by = item?.UpdatedByDetails?.DisplayName;
          obj.last_updated_at = item?.LastUpdatedAt
            ? item?.LastUpdatedAt * 1000
            : undefined;
        }
        if (item.CreatorDetails) {
          obj.last_updated_by = item?.CreatorDetails?.DisplayName;
          obj.last_updated_at = item?.CreatedAt ? item?.CreatedAt * 1000 : undefined;
        }
        // obj.last_updated_by = item.Updator;
        obj.UserRole = item?.UserRole;

        if (item?.UserRole && item?.UserRole?.CreatorDetails && obj.UserRole) {
          obj.UserRole.creator = item?.UserRole?.CreatorDetails;
        }

        if (item.UserRole && item.UserRole.LastUpdatorDetails && obj.UserRole) {
          obj.UserRole.last_updator = item.UserRole.LastUpdatorDetails;
        }

        obj.is_default = item?.is_default;
        obj.NodeRef = item?.NodeRef;
        obj.Parent = item?.Parent;
        obj.password = item?.Password
          ? item?.Password
          : item?.OneTimePassword
            ? item?.OneTimePassword.Password
            : null;
        obj.user_id = item?.UserID ? item?.UserID : null;

        if (item?.Groups && item?.Groups?.length > 0) {
          const adapter = new TagAdapter();
          obj.groups = item.Groups.map((item: any) => adapter.adapt(item));

          let group_titles = "";
          if (obj.groups.length > 0) {
            for (const element of obj.groups) {
              group_titles = group_titles
                ? group_titles + "," + element.title
                : group_titles + element.title;
            }
            obj.group_titles = group_titles;
          }
        } else if (item.ResourceTags && item.ResourceTags.length > 0) {
          const adapter = new TagAdapter();
          obj.groups = item.ResourceTags.map((item: any) => adapter.adapt(item.Tag));
        }

        // obj.UserRole = new UserRole();
        // if(item.UserRole.Role) {
        // obj.UserRole.Role = new Role();
        // obj.UserRole.Role.ID = item.UserRoles.Role.ID;
        // obj.UserRole.Role.Name = item.UserRoles.Role.Name ? item.UserRoles.Role.Name: '';
        // }
        // obj.UserDetail=item.UserDetail;
        if (item.UserDetail) {
          obj.UserDetail = item.UserDetail ?? {};
          if (obj.UserDetail) {
            obj.UserDetail.id = item?.UserDetail?.ID;
            obj.UserDetail.user_id = item?.UserDetail?.User;
            obj.UserDetail.line1 = item?.UserDetail?.Line1;
            obj.UserDetail.city = item?.UserDetail?.City;
            obj.UserDetail.state = item?.UserDetail?.State;
            obj.UserDetail.zipcode = item?.UserDetail?.Zipcode;
            obj.UserDetail.country_id = item?.UserDetail?.Country;
            obj.UserDetail.color = item?.UserDetail?.Color;
            obj.UserDetail.booking_no = item?.UserDetail?.BookingNo;
            obj.UserDetail.billing_no = item?.UserDetail?.BillingNo;
            obj.UserDetail.ship_card_no = item?.UserDetail?.ShipCardNo;
            obj.UserDetail.status = item?.UserDetail?.Status;
            obj.UserDetail.creator_id = item?.UserDetail?.Creator;
            obj.UserDetail.last_updated_by = item?.UserDetail?.Updator;
            obj.UserDetail.ip_address = item?.UserDetail?.IpAddress;
            obj.UserDetail.user_agent = item?.UserDetail?.UserAgent;
            obj.UserDetail.device_id = item?.UserDetail?.DeviceID;
            obj.UserDetail.platform_id = item?.UserDetail?.Platform;
            obj.UserDetail.pos_client_id = item?.UserDetail?.PosClient;
            obj.UserDetail.embarkation_date = item?.UserDetail?.EmbarkationDate;
            obj.UserDetail.disembarkation_date =
              item?.UserDetail?.DisembarkationDate;
            obj.UserDetail.created_at = item?.UserDetail?.CreatedAt;
            obj.UserDetail.last_updated_at = item?.UserDetail?.LastUpdatedAt;
            obj.UserDetail.pier_status = item?.UserDetail?.PierStatus;
            obj.UserDetail.pier_checkin_by = item?.UserDetail?.PierCheckinBy;
            obj.UserDetail.pier_checkin_at = item?.UserDetail?.PierCheckinAt;
            obj.UserDetail.concierge_status = item?.UserDetail?.ConciergeStatus;
            obj.UserDetail.concierge_checkin_by =
              item?.UserDetail?.ConciergeCheckinBy;
            obj.UserDetail.concierge_checkin_at =
              item.UserDetail?.ConciergeCheckinAt;
            obj.UserDetail.group_id = item?.UserDetail?.GroupNo;
          }
        } else {
          obj.UserDetail = item?.UserDetail ? item?.UserDetail : {};
          // obj.UserDetail = {}
        }

        if (item.UserImage) {
          obj.UserImage = item.UserImage;
          if (item?.UserImage) {
            obj.UserImage = obj.UserImage || new UserImage();
            obj.UserImage.id = item.UserImage?.ID;
            obj.UserImage.user_id = item.UserImage?.User;
            obj.UserImage.image = item.UserImage?.Image;
            obj.UserImage.status = item.UserImage?.Status;
            obj.UserImage.creator_id = item.UserImage?.Creator;
            obj.UserImage.last_updated_by = item.UserImage?.LastUpdator;
            obj.UserImage.ip_address = item.UserImage?.IpAddress;
            obj.UserImage.user_agent = item.UserImage?.UserAgent;
            obj.UserImage.device_id = item.UserImage?.DeviceID;
            obj.UserImage.platform_id = item.UserImage?.Platform;
            obj.UserImage.pos_client_id = item.UserImage?.POSClient;
            obj.UserImage.created_at = item.UserImage?.CreatedAt;
            obj.UserImage.last_updated_at = item.UserImage?.LastUpdatedAt;
          } else {
            obj.UserImage = item?.UserImage ?? {};
          }

          if (item?.updateRoleEmployee?.ResponceMsg) {
            obj.Msg = item.updateRoleEmployee.ResponceMsg?.Msg;
            obj.Status = item.updateRoleEmployee.ResponceMsg?.Status;
          }
        }

        // ID: "1568724998606"
        // OrganisationHierarchy: null
        // Roles: {Name: "Administrator", ID: "2", __typename: "Role"}
        // User: "1568724998545"
        // __typename: "UserbasedRole"
        // __proto__: Object
        // length: 1

        // if (!item.Roles)
        //   item.Roles = item.UserRole.Roles
        if (item?.Roles) {
  obj.roleId = item.Roles?.ID;
  obj.Name = item.Roles?.Name;
  obj.userid = item?.User ?? item?.ID;
  obj.is_default = item?.is_default ?? 0;
  obj.NodeRef = item?.NodeRef ?? null;

  if (item?.OrganisationHierarchy) {
    obj.folderName = item.OrganisationHierarchy?.label;
  }
}

obj.cursor = item?.cursor;

obj.UserDisabilities = Array.isArray(item?.UserDisabilities)
  ? item.UserDisabilities
  : [];

// Optionally uncomment if needed:
// obj.UserImage.image = item?.UserImage?.image ?? '';

        //obj.UserImage.image=item.UserImage.image ? item.UserImage.image : '';
      }
      return obj;
    } catch (error) {
      console.log("Employee Adapt error:", error);
      const obj = new Employee();
      if (obj.ResponceGql) {
        obj.ResponceGql.Msg = item?.ResponceGql?.Msg ? item?.ResponceGql?.Msg : "";
        obj.ResponceGql.Status = item?.ResponceGql?.Status
          ? item?.ResponceGql?.Status
          : false;
      }
      return obj;
    }
  }
};

export class BCEmployeeAdapter implements Adapter<Employee> {
  adapt(item: any): Employee {
    const obj = new Employee();

    try {
      obj.id = item?.UsersNew?.ID;
      //obj.Name = item.Name;
      //obj.ship_id = item.Ship;
      //obj.voyage_id = parseInt(item.UsersNew.Voyage);
      obj.title = item?.UsersNew?.Title ? item?.UsersNew?.Title : null;
      obj.first_name = item?.UsersNew?.FirstName;
      obj.last_name = item?.UsersNew?.LastName;
      obj.gender = item?.UsersNew?.Gender ? item?.UsersNew?.Gender : null;
      obj.birth_date = item?.UsersNew?.BirthDate ? item?.UsersNew?.BirthDate : null;
      obj.email = item?.UsersNew?.Email ? item?.UsersNew?.Email : null;
      obj.user_id = item?.UsersNew?.UserID ? item?.UsersNew?.UserID : null;
      obj.isHidden = item.Roles.IsHidden == 1 ? true : false;
      // obj.employee_code = item.EmployeeCode;
      // obj.phone = item.Phone;
      // obj.mobile = item.Mobile;
      // obj.preferred_language = item.PreferredLanguage;
      // obj.nationality = item.Nationality;
      // obj.passenger_num = item.PassengerNo;
      // obj.account = item.Account;
      // obj.employee_no = item.EmployeNo;
      // obj.display_name = item.DisplayName;
      // obj.employee_type = item.EmployeeType;
      // obj.brand_id = item.Brand;
      // obj.rfid = item.RfID;
      // obj.guest_type = item.GuestType;
      // obj.cabin_no = item.CabinNo;
      // obj.access_type = item.AccessType;
      // obj.status = item.Status;
      // obj.payroll_id = item.PayrollID;
      // obj.ip_address = item.IpAddress;
      // obj.user_agent = item.UserAgent;
      // obj.device_id = item.DeviceID;
      // obj.platform_id = item.PlatformID;
      // obj.pos_client_id = item.PosClient;
      //obj.creator_id = item.Creator;
      obj.created_at = item.CreatedAt;
      obj.userHealthCheck = item.UsersNew.UserHealthCheck
        ? item.UsersNew.UserHealthCheck
        : null;
      obj.UserDeviceAssignment = item.UsersNew.UserDeviceAssignment
        ? item.UsersNew.UserDeviceAssignment.DeviceId
        : null;
      obj.last_updated_at = item.LastUpdatedAt
        ? item.LastUpdatedAt * 1000
        : undefined;
      obj.last_updated_at = obj.last_updated_at
        ? obj.last_updated_at
        : item.CreatedAt
        ? item.CreatedAt * 1000
        : undefined;

      if (item.ResponceMsg) {
        obj.ResponceGql = new ResponceGql();
        obj.ResponceGql.Msg = item.ResponceMsg.Msg ? item.ResponceMsg.Msg : "";
        obj.ResponceGql.Status = item.ResponceMsg.Status
          ? item.ResponceMsg.Status
          : false;
      }

      if (item.LastUpdatorDetails) {
        obj.last_updated_by = item.LastUpdatorDetails.DisplayName;
      }
      if (item.CreatorDetails) {
        obj.last_updated_by = obj.last_updated_by
          ? obj.last_updated_by
          : item.CreatorDetails.DisplayName;
      }
      // obj.last_updated_by = item.Updator;
      obj.UserRole = item.UserRole;

      // if (item.UserRole && item.UserRole.CreatorDetails) {
      //   obj.UserRole.creator = item.UserRole.CreatorDetails
      // }

      // if (item.UserRole && item.UserRole.LastUpdatorDetails) {
      //   obj.UserRole.last_updator = item.UserRole.LastUpdatorDetails
      // }

      //obj.is_default = item.is_default;
      //obj.NodeRef = item.NodeRef;
      //obj.Parent = item.Parent;
      //obj.password = item.Password ? item.Password : null;

      if (item.Groups && item.Groups.length > 0) {
        const adapter = new TagAdapter();
        obj.groups = item.Groups.map((item: any) => adapter.adapt(item));

        let group_titles = "";
        if (obj.groups.length > 0) {
          for (const element of obj.groups) {
           group_titles = group_titles
              ? (group_titles = group_titles + "," + element.title)
              : (group_titles = group_titles + element.title);
          }
          obj.group_titles = group_titles;
        }
      }

      if (item.UsersNew.ResourceTags && item.UsersNew.ResourceTags.length > 0) {
        const adapter = new TagAdapter();
        obj.groups = item.UsersNew.ResourceTags.map((item: any) =>
          adapter.adapt(item.Tag)
        );
      }

      if (item.Roles) {
        // obj.userid = item..ID;

        obj.roleId = item.Role;
        // obj.id = item.ID;
        obj.Name = item.Roles.Name;
        //obj.userid = (item.User) ? item.User : item.ID;
        //obj.is_default = (item.is_default) ? item.is_default : 0;
        //obj.NodeRef = (item.NodeRef) ? item.NodeRef : null;

        if (item.OrganisationHierarchy) {
          obj.folderName = item.OrganisationHierarchy.label;
        }
      }

      obj.cursor = item.cursor;
      //obj.UserDisabilities = (item.UserDisabilities && item.UserDisabilities instanceof Array ? item.UserDisabilities : []);

      return obj;
    } catch (error) {
      console.log("BCEmployeeAdapter:", error);
      return obj;
    }
  }
};


export class Cursors {
  after?: string | null;
  before?: string | null;
  hasNext?: boolean | false;
  hasPrevious?: boolean | false;
};

export class BCEmployees {
  employees!: Employee[];
  totalCount?: number;
  cursorData?: Cursors;
}

export class BCEmployeesListAdapter implements Adapter<BCEmployees> {
  adapt(item: any): BCEmployees {
    // console.log("BCEmployeesResponse: ", item)
    try {
      const obj = new BCEmployees();

      if (item.results) {
        if(item.pageState === "assigned"){
          const adapter = new BCEmployeeAdapter();
          obj.employees = item.results.map((emp: any) => adapter.adapt(emp));
        } else {
          const adapter = new EmployeeAdapter();
          obj.employees = item.results.map((emp: any) => adapter.adapt(emp));
        }
         
      }

      if (item.cursors) {
        obj.cursorData = new Cursors();
        obj.cursorData.after = item.cursors.after ? item.cursors.after : null;
        obj.cursorData.before = item.cursors.before
          ? item.cursors.before
          : null;
        obj.cursorData.hasPrevious = item.cursors.hasPrevious
          ? item.cursors.hasPrevious
          : null;
        obj.cursorData.hasNext = item.cursors.hasNext
          ? item.cursors.hasNext
          : null;
      }

      //obj.totalCount = item.count ? item.count : 0;

      // console.log("BCEmployeesListAdapter - Success: ", obj)
      return obj;
    } catch (error) {
      console.log("BCEmployeesListAdapter - error:", error);
      return new BCEmployees();
    }
  }
}

export class EmployeeSelection {
  AllSelected!:boolean;
   IncludeIds?:number[];
   ExcludeIds?:number[];
   static formDta(payload:any):EmployeeSelection{
     const obj = new EmployeeSelection();
     obj.AllSelected = payload.AllSelected ?? false;
     obj.IncludeIds = payload.map((item:any) => item.id) ?? [];
     obj.ExcludeIds = payload.ExcludeIds ?? [];
     return obj;
   }
   
}

export class AssignedEmployeePayLoad {
  EmpSelection!: EmployeeSelection;
  NodeRef!:number;
  RoleId!: number;

  static formDta(payload:any):AssignedEmployeePayLoad{
    const obj = new AssignedEmployeePayLoad();
    obj.EmpSelection =  EmployeeSelection.formDta(payload?.assignedEmployee);
    obj.NodeRef = payload.selectedBCId;
    obj.RoleId = payload.selectedRole;
    return obj;
  }



}

