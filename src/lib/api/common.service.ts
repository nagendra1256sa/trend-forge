import { axiosInstances } from "./networkinstances";

export interface MasterJsonResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const commonService = {

  async getMasterJson(headerValue = {}): Promise<MasterJsonResponse> {
    try {
      const config = headerValue
        ? { headers: headerValue }
        : {};
      const response = await axiosInstances.get('common', config);
      return {
        success: true,
        data: response?.data,
      }

    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error?.message : "Unknown error",
      }
    }

  },

}

export const getSelectQuery = (params: any = []) => {
  let queryStr = "";
  const queryStrArr = [];
  for (const rec of params) {
    if (rec.type == "field") {
      queryStrArr.push(rec.ref);
    } else if (rec.type == "object") {
      if (Object.prototype.hasOwnProperty.call(rec.data, "type")) {
        const tempString =
          rec.data.ref + "{\n" + rec.data.data.join("\n") + "\n}";
        queryStrArr.push(rec.ref + "{\n" + tempString + "\n}");
      } else {
        queryStrArr.push(rec.ref + "{\n" + rec.data.join("\n") + "\n}");
      }
    }
  }
  queryStr = queryStrArr.join("\n");
  return queryStr;
}

