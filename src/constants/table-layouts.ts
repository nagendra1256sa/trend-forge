import { TableDetails } from "@/models/table-layout";

export class TableBinder {
  Id?: number;
  Section!: string;
  Name!: string;
  Seats!: number;
  Status!: number;
  x!: string;
  y!: string;
  Shape!: string;
  IsVipTable!: boolean;
  public static bind(data: TableDetails): TableBinder {
    const binder = new TableBinder();
    binder.Name = data.name ?? '';
    binder.Seats = data.seats ?? 4;
    binder.Status = data.status ?? 1;
    binder.x = String(data.x) || '90';
    binder.y = String(data.y) || '90';
    binder.Shape = data.shape ?? 'round';
    binder.IsVipTable = data.isVipTable ?? false;
    return binder;
  }
}

export const statusArray = [
  {
    value: 1,
    label: "Active"
  },
  {
    value: 2,
    label: "Inactive"
  },
  {
    value: 3,
    label: "Occupied"
  }
]


export class NewSectionBinder {
  name!: string;
  description?: string;
  public static bind(data: any): NewSectionBinder {
    const binder = new NewSectionBinder();
    binder.name = data.name ?? '';
    binder.description = data.description;
    return binder;
  }
}