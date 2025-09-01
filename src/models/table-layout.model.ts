import { TableData } from "@/components/table-layouts/table-edit-form";

export class UpdateTablePayLoad {
    name!:string;
    capacity!:number;
    status!:number;
    isVipTable!:boolean;
    layoutId!:number;
    shape!:string;
    x!:string;
    y!:string;
    seats?: number;

    static BindForm(data:TableData, isNewTableUpdate = false, adjustedPoints?:any):UpdateTablePayLoad{
        const payload = new UpdateTablePayLoad();
        payload.name = data.Table_Name;
        payload.capacity = data.Capacity;
        payload.status = data.status;
        if(isNewTableUpdate)
        payload.seats = data?.Capacity;
        payload.isVipTable = data.VIP_Table;
        payload.shape = data.shape;
        payload.x = adjustedPoints ? String(adjustedPoints?.x) : String(data?.x);
        payload.y = adjustedPoints ? String(adjustedPoints?.y) : String(adjustedPoints?.y);
        payload.layoutId = data.Section;
        return payload;

    }

}