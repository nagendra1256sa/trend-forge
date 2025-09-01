import { Reason, ReasonAdapter, ReasonInputs, ReasonTypeAdapter, ReasonTypes } from "@/models/reasons";
import { graphqlQuery } from './graphql.service';

export interface GetReasonsResponse {
    success: boolean;
    reasons?: Reason[];
    message?: string;
};

export interface GetReasonsResponseById {
    success: boolean;
    reason?: Reason;
    message?: string;
}

export interface CreateReasonResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface GetReasonTypeResponse {
  success: boolean;
  reasonsType?: ReasonTypes[];
  message?: string;
}

export interface UpdateReasonResponse {
  success: boolean;
  data?: any;
  message?: string;
}
  const selectDef = [
    { ref: "ID", type: "field" },
    { ref: "Reason", type: "field" },
    { ref: "ReasonType", type: "field" },
    { ref: "Description", type: "field" },
    { ref: "NodeRef", type: "field" },
    { ref: "Parent", type: "field" },
    { ref: "Status", type: "field" },
    { ref: "ReasonTypeObj", type: "object", data: ["Type"] },
  ];
  const LIST_QRY = "getReasons";
  const  CREATE_QRY = "createReason";

export const getReasons = async (bcId: number): Promise<GetReasonsResponse> => {

  try {
    const response = await graphqlQuery({
      operation: "NR",
      params: selectDef,
      funName: LIST_QRY,
      id: bcId

    });

    const reasons = response?.data?.[LIST_QRY] ?? [];

    return {
      success: true,
      reasons: reasons.map((item: any) => new ReasonAdapter().adapt(item)),
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.msg || error?.msg || error?.message || error?.response?.data?.message || "Something went wrong";

    return {
      success: false,
      message,
    };

  }
}

export const getReasonType = async (): Promise<GetReasonTypeResponse> => {
  const selectDef = [
    { ref: "ID", type: "field" },
    { ref: "Type", type: "field" },
  ];
  const LIST_QRY = "getReasonTypes";
  try {
    const response = await graphqlQuery({
      operation: "R",
      params: selectDef,
      funName: LIST_QRY,
    });
    const reasons = response?.data?.data?.[LIST_QRY] ?? [];
    return {
      success: true,
      reasonsType: reasons.map((item: any) => new ReasonTypeAdapter().adapt(item)),
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.msg || error?.msg || error?.message || error?.response?.data?.message || "Something went wrong";

    return {
      success: false,
      message,
    };

  }
}

export const createReason = async (formData: ReasonInputs): Promise<CreateReasonResponse> => {
  try {
    const response = await graphqlQuery({
      operation: "C",
      params: [],
      funName: CREATE_QRY,
      id: null,
      typeDef: "$postData:ReasonInput",
      variables: formData,
      selectionParams: selectDef
    });
    return {
      success: true,
      data: response?.data?.data?.createReason,
    };
  } catch (error: any) {
    const message =
      error.ApolloError?.message || error?.msg || error?.message || error?.response?.data?.message || "Something went wrong";
    return {
      success: false,
      message,
    };

  }
}


export const getReasonById = async (id: number): Promise<any> => {
  try {
    const response = await graphqlQuery({
      operation: "R",
      params: selectDef,
      funName: "getReason",
      id
    });
    return {
      success: true,
      data: response?.data?.getReason,
    };
  } catch (error: any) {
    const message =
      error.ApolloError?.message || error?.msg || error?.message || error?.response?.data?.message || "Something went wrong";
    return {
      success: false,
      message,
    };

  }
}


export const updateReasonById = async (id: number, formData: ReasonInputs): Promise<UpdateReasonResponse> => {
  try {
    const response = await graphqlQuery({
      operation: "U",
      params: [],
      funName: "updateReason",
      id,
      typeDef: "$postData:ReasonInput",
      variables: formData,
      selectionParams: selectDef
    });
    return {
      success: true,
      data: response?.data?.updateReason,
    };
   
  } catch (error: any) {
   const message =
      error.ApolloError?.message || error?.msg || error?.message || error?.response?.data?.message || "Something went wrong";
    return {
      success: false,
      message,
    };

  }
}

export const getReasonsById = async (reasonId: number): Promise<GetReasonsResponseById> => {
const selectDef = [
    { ref: "ID", type: "field" },
    { ref: "Reason", type: "field" },
    { ref: "ReasonType", type: "field" },
    { ref: "Description", type: "field" },
    { ref: "NodeRef", type: "field" },
    { ref: "Parent", type: "field" },
    { ref: "Status", type: "field" },
    { ref: "ReasonTypeObj", type: "object", data: ["Type"] },
  ];
   const DETAIL_QRY = "getReason";
  
   try {
      const response = await graphqlQuery({
        operation: "R",
        params: selectDef,
        funName: DETAIL_QRY,
        id: reasonId

      });
  
      const reason = response?.data?.[DETAIL_QRY] ?? [];
  
      return {
        success: true,
        reason:  new ReasonAdapter().adapt(reason),
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.msg || error?.msg || error?.message ||  error?.response?.data?.message  || "Something went wrong";
  
      return {
        success: false,
        message,
      };

   }
}

