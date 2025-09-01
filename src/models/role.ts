import { Adapter } from "./adapter";

export class ResponceGql {
  msg: string = '';
  status: boolean = false;
}

export class Role {
  id: number = 0;
  name: string = "";
  status: number = 0;
  isHidden: number = 0;
  description: string = "";
  responceGql: ResponceGql = new ResponceGql();
}

export class RoleAdapter implements Adapter<Role> {
  adapt(item: any): Role {
    const role = new Role();

    try {
      role.id = Number.parseInt(item?.ID ?? "0");
      role.name = item?.Name ?? "";
      role.status = item?.Status ?? 0;
      role.isHidden = item?.IsHidden ?? 0;
      role.description = item?.Description ?? "";

      // Handle ResponceMsg
      const response = item?.ResponceMsg;
      if (response) {
        role.responceGql = new ResponceGql();
        role.responceGql.msg = response?.Msg ?? "";
        role.responceGql.status = response?.Status ?? false;
      }

      // Handle RolePermission
    //   const permissions = item?.RolePermission;
    //   if (Array.isArray(permissions)) {
    //     role.rolePermission = permissions;
    //     role.permissionIds = permissions
    //       .filter((p) => p?.permission_id != null)
    //       .map((p) => p.permission_id);
    //   }
    // } catch (error) {
    //   console.error("Error adapting role object:", error);
    // }

    return role;
  } catch (error) {
    console.error("Error adapting role object:", error);
    return role; 
  }

 }
}
