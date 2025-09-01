

export class EmployeeFilter {
  param!: string;
  value!: string[] | number[] | { formDate: string; toDate: string } | string | null;
  values!: string[] | null;
}
export class FilterPayloadForEmployee {
  Filters: EmployeeFilter[] = [];

  static BindForm(body: {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string[];
  }): EmployeeFilter[] {
    const filters: EmployeeFilter[] = [];

      if(body?.employeeId) {
      filters.push({
        param: "UserID",
        value: body?.employeeId,
        values: null
      });
    };

    if(body?.email){
        filters.push({
        param: "Email",
        value: body?.email,
         values: null
      });
    };

    if(body?.firstName) {
      filters.push({
        param: "FirstName",
        value: body?.firstName,
         values: null
      });
    };

    if(body?.lastName) {
        filters.push({
        param: "LastName",
        value: body?.lastName,
         values: null
      });
    };

    if(Array.isArray(body?.role) && body?.role?.length > 0) {
        filters.push({
        param: "Role",
        values: body?.role?.map(String),
        value: null
      });
    };

      

   
    return filters;
  }
};

export class BulkRemoveEmployeeBinder {
  EmpSelection?: EmpSelectionBinder = new EmpSelectionBinder();
  NodeRef?: number;

  public static bind(data: any): BulkRemoveEmployeeBinder {
    const binder = new BulkRemoveEmployeeBinder();
    binder.NodeRef = Number(data?.nodeRef);
    binder.EmpSelection = EmpSelectionBinder.bind({
      includeIds: data?.includeIds ?? [],
      excludeIds: data?.excludeIds ?? [],
      allSelected: data?.allSelected ?? false
    });
    return binder;
  }
}

export class EmpSelectionBinder {
  IncludeIds?: number[] = [];
  ExcludeIds?: number[] = [];
  AllSelected?: boolean = false;

  public static bind(data: any): EmpSelectionBinder {
    const binder = new EmpSelectionBinder();
    binder.IncludeIds = data?.includeIds ?? [];
    binder.ExcludeIds = data?.excludeIds ?? [];
    binder.AllSelected = data?.allSelected ?? false;
    return binder;
  }
}
export class ExportEmployeeBinder {
  Type?:string;
  Selection?: EmpSelectionBinder;
  NodeRef?: number;

  public static bind(data: any): BulkRemoveEmployeeBinder {
    const binder = new ExportEmployeeBinder();
    binder.Type = data?.type;
    binder.NodeRef = Number(data?.nodeRef);
    binder.Selection = EmpSelectionBinder?.bind({
      includeIds: data?.includeIds ?? [],
      excludeIds: data?.excludeIds ?? [],
      allSelected: data?.allSelected ?? false
    });
    return binder;
  }
}
export enum EmployeeListType {
  Unassigned = 'unassigned',
  Assigned = 'assigned',
}

export const EMPLOYEE_TITLE_OPTIONS = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
  { label: "Ms", value: "Ms" },
];