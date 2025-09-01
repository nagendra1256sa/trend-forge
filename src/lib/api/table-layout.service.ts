import { AddNewSectionResponse, CreateTableResponse, DeleteTableResponse, GetLayoutsResponse, GetTableDetailsResponse, updateTableResponse } from "@/types/table-layout";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkinstances"
import { TableDetailsViewAdapter, TableLayoutAdapter } from "@/models/table-layout";
import { UpdateTablePayLoad } from "@/models/table-layout.model";
import { NewSectionBinder, TableBinder } from "@/constants/table-layouts";


export const getSectionsLayouts = async (bcId: number): Promise<GetLayoutsResponse> => {
  // const mockLayouts = [
  //   {
  //     "id": 1,
  //     "name": "Main Hall Layout",
  //     "description": "Main dining layout for dinner service",
  //     "status": 1,
  //     "NodeRef": "5",
  //     "Creator": 101,
  //     "CreatedAt": "2025-06-08T06:33:04.887Z",
  //     "LastUpdator": null,
  //     "LastUpdatedAt": null
  //   },
  //   {
  //     "id": 2,
  //     "name": "Main Hall",
  //     "description": "Main dining layout for dinner service",
  //     "status": 1,
  //     "NodeRef": "5",
  //     "Creator": 101,
  //     "CreatedAt": "2025-06-08T06:33:04.887Z",
  //     "LastUpdator": null,
  //     "LastUpdatedAt": null
  //   },
  //   {
  //     "id": 3,
  //     "name": "Hall Layout",
  //     "description": "Main dining layout for dinner service",
  //     "status": 1,
  //     "NodeRef": "5",
  //     "Creator": 101,
  //     "CreatedAt": "2025-06-08T06:33:04.887Z",
  //     "LastUpdator": null,
  //     "LastUpdatedAt": null
  //   },
  // ];
  try {
    const response = await axiosInstances.get(apiUrlPaths?.tableLayout?.getLayouts(bcId));
    if (response?.status === 200 || response?.status === 204) {
      return {
        success: true,
        layouts: (response?.data as any[]).map((layout: any) => new TableLayoutAdapter().adapt(layout)),
      }
    }

    return {
      success: false,
      layouts: [],
      message: response?.data?.message
    }
  } catch (error: any) {
    let message;
    if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      layouts: [],
      message
    };
  }
}

export const getLayoutTables = async (layoutId: number, bcId: number): Promise<GetTableDetailsResponse> => {
  // const mockTables = [
  //   {
  //     "ID": 2,
  //     "Name": "t2",
  //     "NodeRef": "5",
  //     "Seats": 4,
  //     "Status": 1,
  //     "Creator": 2,
  //     "CreatedAt": "2025-05-20T09:36:00.509Z",
  //     "LastUpdator": null,
  //     "LastUpdatedAt": "2025-05-20T09:36:00.509Z",
  //     "x": "174.59375",
  //     "y": "279.02081298828125",
  //     "Shape": 'square',
  //     "IsVipTable": false
  //   },
  //   {
  //     "ID": 1,
  //     "Name": "t1",
  //     "NodeRef": "5",
  //     "Seats": 4,
  //     "Status": 2,
  //     "Creator": 2,
  //     "CreatedAt": "2025-05-07T11:05:32.175Z",
  //     "LastUpdator": 2,
  //     "LastUpdatedAt": "2025-05-20T09:30:26.613Z",
  //     "x": "228.59375",
  //     "y": "124.02081298828125",
  //     "Shape": 'square',
  //     "IsVipTable": false
  //   },
  //   {
  //     "ID": 3,
  //     "Name": "t1",
  //     "NodeRef": "5",
  //     "Seats": 4,
  //     "Status": 3,
  //     "Creator": 2,
  //     "CreatedAt": "2025-05-07T11:05:32.175Z",
  //     "LastUpdator": 2,
  //     "LastUpdatedAt": "2025-05-20T09:30:26.613Z",
  //     "x": "380.59375",
  //     "y": "183.97918701171875",
  //     "Shape": 'round',
  //     "IsVipTable": false
  //   }
  // ];
  try {
    const response = await axiosInstances.get(apiUrlPaths?.tableLayout?.getTables(bcId), {
      params: {
        layoutid: layoutId
      }
    });
    if (response?.status === 200 || response?.status === 204) {
      return {
        success: true,
        tables: (response?.data as any[]).map((layout: any) => new TableDetailsViewAdapter().adapt(layout)),
      }
    }

    return {
      success: false,
      tables: [],
      message: response?.data?.message
    }
  } catch (error: any) {
    let message;
    if (error?.response?.data?.msg) {
      message = error.response.data.msg;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      tables: [],
      message
    };
  }
}

export const updateTable = async (layoutId: number, payLoad: UpdateTablePayLoad, tableId: number, selectedBCId: number): Promise<updateTableResponse> => {
  try {
    const response = await axiosInstances.put(apiUrlPaths?.tableLayout?.updateTable(layoutId, tableId), payLoad, {
      headers: {
        'business_center': selectedBCId,
        'pos_client_code': 'waiter_app',
      },
    });
    return response?.status === 200 ? {
      success: true,
    } : {
      success: false,
    };

  } catch (error: any) {
    let message;
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  }
}

export const createLayout = async (layoutId: number, tableData: TableBinder[], bcId: number): Promise<CreateTableResponse> => {
  try {
    const response = await axiosInstances.post(apiUrlPaths?.tableLayout?.createTable(layoutId), tableData, {
      headers: {
        pos_client_code: 'business_cenetr',
        business_center: bcId,
      }
    });
    if (response?.status === 200 || response?.status === 201) {
      return {
        success: true,
        message: response?.data?.message,
        skipped: response?.data?.skipped,
      }
    }

    return {
      success: false,
      message: response?.data?.message,
    }
  } catch (error: any) {
    let message;
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  }
}

export const deleteTable = async (layoutId: number, tableId: number[], bcId: number): Promise<DeleteTableResponse> => {
  try {
    const response = await axiosInstances.put(apiUrlPaths?.tableLayout?.deleteTable(layoutId), { ids: tableId }, {
      headers: {
        business_center: bcId,
      }
    });
    return response?.status === 200 ? {
      success: true,
    } : {
      success: false,
    };

  } catch (error: any) {
    let message;
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  }
}

export const addNewSection = async (payLoad: NewSectionBinder, bcId: number): Promise<AddNewSectionResponse> => {
  try {
    const response = await axiosInstances.post(apiUrlPaths?.tableLayout?.addNewSection(), payLoad, {
      headers: {
        'business_center': bcId,
        'pos_client_code': 'waiter_app',
      },
    });
    return response?.status === 201 || response?.status === 200 ? {
      success: true,
    } : {
      success: false,
    };

  } catch (error: any) {
    let message;
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.msg) {
      message = error.message;
    };

    return {
      success: false,
      message
    };
  }
}
