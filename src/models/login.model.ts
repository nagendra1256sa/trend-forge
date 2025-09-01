import { Adapter } from "./adapter";



export class Login {
  id?: number;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  userID?: string;
  role_id?: number;
  clientID?: string;
  username?: string;
  status?: number;
  device_id?: string | null;
  additional_info?: any | null;
  NodeRef?: number;
  role?: string;
  label?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export class LoginAdapter implements Adapter<Login> {
  adapt(data: any): Login {
    const loginData = new Login();
    try {
      loginData.id = data?.id;
      loginData.accessToken = data?.accessToken;
      loginData.accessTokenExpiresAt = data?.accessTokenExpiresAt;
      loginData.refreshToken = data?.refreshToken;
      loginData.refreshTokenExpiresAt = data?.refreshTokenExpiresAt;
      loginData.userID = data?.userID;
      loginData.role_id = data?.role_id;
      loginData.clientID = data?.clientID;
      loginData.username = data?.username;
      loginData.status = data?.status;
      loginData.device_id = data?.device_id ?? null;
      loginData.additional_info = data?.additional_info ?? null;
      loginData.NodeRef = data?.NodeRef;
      loginData.role = data?.role;
      loginData.label = data?.label;
      loginData.firstName = data?.FirstName;
      loginData.lastName = data?.LastName;
      loginData.displayName = data?.DisplayName;
    } catch (error) {
      console.error("[LoginAdapter] Adaptation failed:", error);
    }
    return loginData;
  }
}
