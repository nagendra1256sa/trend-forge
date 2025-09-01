import { BCEmployees } from "@/models/employee";
import { Role } from "@/models/role";

export interface EmployeeListResponse {
    success: boolean;
    message?: string;
    employees?: BCEmployees;
};

export interface EmployeeListCountResponse {
    success: boolean;
    count?:number;
    message?: string;
};

export interface useGetEmployeListHookResponse {
  employees: BCEmployees;
  error: string;
   loading: boolean;
  fetchEmployeeList: (limit: number, filters?: EmployeeFilter[], after?: string | null, before?: string | null) => Promise<void>;
};

export interface useGetEmployeListCountResponse {
  employeesCount: number;
  error: string;
  loading: boolean;
  fetchEmployeeListCount: (filters?: EmployeeFilters) => void;
};

export interface RoleResponse {
    success: boolean;
    message?: string;
    roles?: Role[];
   reFetch?: () => void
}

export interface InactivateEmployeeResponse {
    success: boolean;
    message: string;
}
export interface EmployeeByIdGraphQlResponse {
  success: boolean;
  data?: EmployeeDetails;
  message?: string;
}

export interface AssignEmployeeResponse {
    success: boolean;
    message?: string
}
