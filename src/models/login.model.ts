import { Adapter } from "./adapter";



export class Login {
  id?: number;
  accessToken?: string;
  refreshToken?: string;
  // userID?: string;
  email?: string;
  fullname?: string;
  userCode?: string;
  userType?: string;
  isSuperUser?: boolean;
  role?: string;
  // refreshTokenExpiresAt?: string;
  // accessTokenExpiresAt?: string;
  // role_id?: number;
  // clientID?: string;
  // username?: string;
  // status?: number;
  // device_id?: string | null;
  // additional_info?: any | null;
  // NodeRef?: number;
  // role?: string;
  // label?: string;
  // firstName?: string;
  // lastName?: string;
  // displayName?: string;
}

export class LoginAdapter implements Adapter<Login> {
  adapt(data: any): Login {
    const loginData = new Login();
    try {
      loginData.id = data?.id;
      loginData.accessToken = data?.accessToken;
      loginData.refreshToken = data?.refreshToken;
      loginData.role = data?.user?.role;
      loginData.email = data?.user?.email;
      loginData.fullname = data?.user?.full_name;
      loginData.userCode = data?.user?.user_code;
      loginData.userType = data?.user?.user_type;
      loginData.isSuperUser = data?.user?.is_superuser;
      // loginData.userID = data?.userID;
      // loginData.accessTokenExpiresAt = data?.accessTokenExpiresAt;
      // loginData.refreshTokenExpiresAt = data?.refreshTokenExpiresAt;
      // loginData.role_id = data?.role_id;
      // loginData.clientID = data?.clientID;
      // loginData.username = data?.username;
      // loginData.status = data?.status;
      // loginData.device_id = data?.device_id ?? null;
      // loginData.additional_info = data?.additional_info ?? null;
      // loginData.NodeRef = data?.NodeRef;
      // loginData.role = data?.role;
      // loginData.label = data?.label;
      // loginData.firstName = data?.FirstName;
      // loginData.lastName = data?.LastName;
      // loginData.displayName = data?.DisplayName;
    } catch (error) {
      console.error("[LoginAdapter] Adaptation failed:", error);
    }
    return loginData;
  }
}
