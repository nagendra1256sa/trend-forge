import { AssignedEmployeePayLoad, BCEmployeesListAdapter, Employee, EmployeeAdapter } from "@/models/employee";

import {EmployeeListCountResponse, EmployeeByIdGraphQlResponse, EmployeeListResponse, InactivateEmployeeResponse, RoleResponse, AssignEmployeeResponse } from "@/types/employee";
import { OperationType } from "@/types/gratuity";

import { apiUrlPaths } from "./api.paths";
import { graphqlQuery } from "./graphql.service";
import { axiosInstances } from "./networkinstances";
import { EmployeeFilters } from "@/components/employee/employee.filters";
import { RoleAdapter } from "@/models/role";
import { BulkRemoveEmployeeBinder, EmployeeFilter, ExportEmployeeBinder } from "@/constants/employee";

export const getEmployeeList = async (limit: number, bcId: number, filters?: EmployeeFilter[], after?: string | null, before?: string| null, pageState?: string): Promise<EmployeeListResponse> => {
  try {
    const postData = {
      Limit: limit,
      After: after,
      Before: before,
      Filters: filters,
      NodeRef: bcId,
    };
     const api: string = pageState === "assigned" ? apiUrlPaths?.employee?.getEmployeeList : apiUrlPaths?.employee?.getUnassignedEmployees
    const response = await axiosInstances.post(api, postData);
    if (response?.status === 200) {
      const data = response?.data?.data;
	   data.pageState = pageState;
      return {
        success: true,
        employees: new BCEmployeesListAdapter().adapt(data),
      }
    }
    return {
      success: false,
      message: "Failed to fetch employee list",
    };
  } catch (error: any) {
    let message;
    if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  };
};

export const getEmployeeListCount = async (bcId: number, filters?: EmployeeFilters,pageType?: string): Promise<EmployeeListCountResponse> => {
  try {
    const postData = {      
      Filters: filters,
      NodeRef: bcId,
    };
	const apiUrl = pageType === "assigned" ? apiUrlPaths?.employee?.getEmployeeCount : apiUrlPaths?.employee?.getAssignedEmployeeCount
    const response = await axiosInstances.post(apiUrl, postData);
    if (response?.status === 200) {
      const data = response?.data;
      return {
        success: data?.Status,
        count: data?.Msg
      }
    }
    return {
      success: false,
      message: "Failed to fetch employee list",
    };
  } catch (error: any) {
    let message;
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  };
};

export const getRoles = async (): Promise<RoleResponse> => {
  const selectDef = [
    { ref: "ID", type: "field" },
    { ref: "Name", type: "field" },
    { ref: "Description", type: "field" },
    { ref: "Status", type: "field" },
    { ref: "IsHidden", type: "field" },
    { ref: "ResponceMsg", type: "object", data: ["Status", "Msg"] },
  ];

  try {
    const response = await graphqlQuery({
      operation: "R",
      params: selectDef,
      funName: "getRoles",
    });

    const rawRoles = response?.data?.data?.getRoles ?? [];

    return {
      success: true,
      roles: rawRoles.map((item: any) => new RoleAdapter().adapt(item)),
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.msg || error?.msg || error?.message || "Something went wrong";

    return {
      success: false,
      message,
    };
  }
};


export const inactivateEmployee = async (employee: Employee, nodeRef: number): Promise<InactivateEmployeeResponse> => {
  try {
    const postData = {
      userID: employee?.id,
      roleID: employee.roleId,
      nodeRef: nodeRef
    }
    const response: any = await axiosInstances.post(apiUrlPaths?.employee?.inactivateEmployee, postData);
    return response?.status === 200 ? {
      success: true,
      message: response?.data?.message
    } : {
      success: false,
      message: response?.data?.message
    };
  } catch (error: any) {
    let message;
    if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };
    return {
      success: false,
      message
    };
  }
  
}
const selectDef = [
	{ ref: "ID", type: "field" },
	{ ref: "Ship", type: "field" },
	{ ref: "Voyage", type: "field" },
	{ ref: "Title", type: "field" },
	{ ref: "FirstName", type: "field" },
	{ ref: "LastName", type: "field" },
	{ ref: "Gender", type: "field" },
	{ ref: "BirthDate", type: "field" },
	{ ref: "Email", type: "field" },
	{ ref: "Phone", type: "field" },
	{ ref: "Mobile", type: "field" },
	{ ref: "PreferredLanguage", type: "field" },
	{ ref: "Nationality", type: "field" },
	{ ref: "PassengerNo", type: "field" },
	{ ref: "Account", type: "field" },
	{ ref: "EmployeeNo", type: "field" },
	{ ref: "DisplayName", type: "field" },
	{ ref: "EmployeeType", type: "field" },
	{ ref: "Brand", type: "field" },
	{ ref: "RfID", type: "field" },
	{ ref: "GuestType", type: "field" },
	{
		ref: "CabinNo",
		type: "object",
		data: ["ID", "CabinNo", "CabinClass", "Status"],
	},
	{ ref: "AccessType", type: "field" },
	{ ref: "Status", type: "field" },
	{ ref: "PayrollID", type: "field" },
	{ ref: "IpAddress", type: "field" },
	{ ref: "UserAgent", type: "field" },
	{ ref: "DeviceID", type: "field" },
	{ ref: "Platform", type: "field" },
	{ ref: "PosClient", type: "field" },
	{ ref: "Creator", type: "field" },
	{ ref: "Updator", type: "field" },
	{ ref: "EmployeeCode", type: "field" },
	{ ref: "NodeRef", type: "field" },
	{ ref: "Parent", type: "field" },
	{ ref: "LastUpdatedAt", type: "field" },
	{ ref: "CreatedAt", type: "field" },
	{ ref: "Disability", type: "field" },
	{ ref: "Password", type: "field" },
	{ ref: "SubsequentFolderAccess", type: "field" },
	{ ref: "IsSuperUser", type: "field" },
	{ ref: "UserID", type: "field" },
	{
		ref: "UserRole",
		type: "object",
		data: {
			type: "object",
			ref: "Role",
			data: ["Name", "ID", "IsHidden", "Status"],
		},
	},
	{
		ref: "UserDetail",
		type: "object",
		data: [
			"BookingNo",
			"BillingNo",
			"EmbarkationDate",
			"DisembarkationDate",
			"Line1",
			"Country",
			"State",
			"Zipcode",
			"City",
			"ShipCardNo",
		],
	},
	{ ref: "UserImage", type: "object", data: ["Image"] },
	{ ref: "Groups", type: "object", data: ["id", "name", "categoryTitle"] },
	{ ref: "ResponceMsg", type: "object", data: ["Status", "Msg"] },
];
export const getEmployeeByID = async (operation: OperationType, id: number): Promise<EmployeeByIdGraphQlResponse> => {
	const DETAIL_QRY = "getEmployee";
	try {
		const response = await graphqlQuery({
			operation: operation,
			params: selectDef,
			funName: DETAIL_QRY,
			id: id,
		});

		if (response?.data) {
			return {
				success: true,
				data: new EmployeeAdapter().adapt(response?.data[DETAIL_QRY]),
			};
		}

		return {
			success: false,
			message: "Oops something went wrong..!",
		};
	} catch (error: any) {
		let message;
		if (error?.response?.data?.msg) {
			message = error.response.data.msg;
		} else if (error?.msg) {
			message = error.message;
		}
		return {
			success: false,
			message,
		};
	}
};

export const updateEmployee = async (params: any, id: number): Promise<EmployeeByIdGraphQlResponse> => {
	const UPDATE_QRY = "updateEmployee";

	try {
		const response = await graphqlQuery({
			operation: "U",
			funName: UPDATE_QRY,
			id: id,
			typeDef: "$postData: employeeUpdateInput", 
			variables: params, 
			selectionParams: selectDef,
		});

		if (response?.data) {
			return {
				success: true,
				data: new EmployeeAdapter().adapt(response.data[UPDATE_QRY]),
			};
		}

		return {
			success: false,
			message: "Oops something went wrong..!",
		};
	} catch (error: any) {
		let message = "An unexpected error occurred";

		if (error?.response?.data?.msg) {
			message = error.response.data.msg;
		} else if (error?.response?.data?.message) {
			message = error.response.data.message;
		} else if (error?.message) {
			message = error.message;
		} else if (error?.msg) {
			message = error.msg;
		}

		return {
			success: false,
			message,
		};
	}
};

export const assignEmployeeToNodeRef = async (payLoad: AssignedEmployeePayLoad): Promise<AssignEmployeeResponse> => {
  try {
    const response: any = await axiosInstances.post(apiUrlPaths?.employee?.assignEmployee, payLoad);
    return response?.status === 200 ? {
      success: true,
    } : {
      success: false,
    };
  }
  catch (error: any) {
    let message;
    if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };
    return {
      success: false,
      message
    };
  }
}
export const bulkRemoveeEmployees = async (
	payload: BulkRemoveEmployeeBinder
): Promise<InactivateEmployeeResponse> => {
	try {
		const response: any = await axiosInstances.post(
			apiUrlPaths?.employee?.bulkRemoveEmployee,
			payload
		);

		return response?.status === 200
			? { success: true, message: response?.message }
			: { success: false, message: response?.message };
	} catch (error: any) {
		const message =
			error?.response?.data?.msg || error?.msg || "Failed to unassign employees.";
		return { success: false, message };
	}
};
export const exportEmployee = async (
	payload: ExportEmployeeBinder
): Promise<InactivateEmployeeResponse> => {
	try {
		const response: any = await axiosInstances.post(
			apiUrlPaths?.employee?.exportEmployees,
			payload
		);
		return response?.status === 200
			? { success: true, message: response?.message }
			: { success: false, message: response?.message };
	} catch (error: any) {
		const message =
			error?.response?.data?.msg || error?.msg || "Failed to export employees.";
		return { success: false, message };
	}
};


