import { Adapter } from "./adapter";



export class TableDetails {
  id!: number;
  name!: string;
  nodeRef?: string;
  seats?: number;
  status?: number;
  creator?: number;
  createdAt?: string;
  lastUpdator?: number | null;
  lastUpdatedAt?: string;
  x!: number;
  y!: number;
  shape?: string | null;
  isVipTable?: boolean;
  layoutId?: number;
  isNew?: boolean;
}

export class TableDetailsViewAdapter implements Adapter<TableDetails> {

  adapt(tableDetails: any): TableDetails {

    const tableLayout = new TableDetails();

    try {
      tableLayout.id = tableDetails?.ID;
      tableLayout.name = tableDetails?.Name;
      tableLayout.nodeRef = tableDetails?.NodeRef;
      tableLayout.seats = tableDetails?.Seats;
      tableLayout.status = tableDetails?.Status;
      tableLayout.creator = tableDetails?.Creator;
      tableLayout.createdAt = tableDetails?.CreatedAt;
      tableLayout.lastUpdator = tableDetails?.LastUpdator;
      tableLayout.lastUpdatedAt = tableDetails?.LastUpdatedAt;
      tableLayout.x = Number(tableDetails?.x) ? tableDetails?.x : Number.parseFloat(tableDetails?.x);
      tableLayout.y = Number(tableDetails?.y) ? tableDetails?.y : Number.parseFloat(tableDetails?.y);;
      tableLayout.shape = tableDetails?.Shape;
      tableLayout.isVipTable = tableDetails?.IsVipTable;
      tableLayout.layoutId = tableDetails?.LayoutId;
      tableDetails.isNew = false;
    } catch (error: any) {
      console.log(error);
    }

    return tableLayout;
  }

}

export class SectionLayout {
  id!: number;
  name!: string;
  description?: string;
  status?: number;
  NodeRef?: string;
  Creator?: number;
  CreatedAt?: string;
  LastUpdator?: number | null;
  LastUpdatedAt?: string | null;
}

export class TableLayoutAdapter implements Adapter<SectionLayout> {
  adapt(item: any): SectionLayout {
    return {
      id: item?.id ?? 0,
      name: item?.name ?? '',
      description: item?.description ?? '',
      status: item?.status ?? 0,
      NodeRef: item?.NodeRef ?? '',
      Creator: item?.Creator ?? 0,
      CreatedAt: item?.CreatedAt ?? '',
      LastUpdator: item?.LastUpdator ?? null,
      LastUpdatedAt: item?.LastUpdatedAt ?? null
    };
  }
}