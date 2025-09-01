import { Adapter } from "./adapter";


export class ReasonInputs {
  ReasonType!: number;
  Reason!: string;
  Description?: string;
  NodeRef!: number;
  Parent!: number;
  Status!: number;
   updateFromForm(formData:any) {
    if (formData.reasonTitle) {
      this.Reason = formData.reasonTitle;
    }
    this.ReasonType = formData.reasonType;
    this.Description = formData.description;
    if (formData.status) {
      this.Status = formData.status;
    }
  }
}
export class Reason {
  ID!: number;
  ReasonType!: number;
  Reason!: string;
  Description?: string;
  ReasonTypeObj?: ReasonTypes;
  NodeRef?: number;  
  Parent?: number;    
  Status?: number;    
}

export class ReasonTypeInputs {
  success!: boolean;
  message!: string;
};

export class ReasonTypes {
  ID!: number ;
  Type!: string ;
}

export class ReasonTypeAdapter implements Adapter<ReasonTypes> {
  adapt(item:any): ReasonTypes {
    const obj = new ReasonTypes();
    try {
      obj.ID = item?.ID ? Number.parseInt(item?.ID) : item.ID;
      obj.Type = item?.Type;
    } catch (error) {
      console.error("Error adapting ReasonTypes:", error);
    }
    return obj;
  }
}


export class ReasonAdapter implements Adapter<Reason> {
  adapt(item: any): Reason {
    try {
      if (item) {
        const obj = new Reason();
        obj.ID = item?.ID ? Number.parseInt(item?.ID) : 0;
        obj.ReasonType = item?.ReasonType ? item?.ReasonType : 0;
        obj.Reason = item?.Reason ? item.Reason : "";
        obj.Description = item?.Description ? item?.Description : "";
        obj.NodeRef = item?.NodeRef ? item?.NodeRef : 0;
        obj.Parent = item?.Parent ? item?.Parent : 0;
        obj.Status = item?.Status ? item?.Status : 0;
        
        const typeObj = new ReasonTypeAdapter();
        obj.ReasonTypeObj = item?.ReasonTypeObj ? typeObj?.adapt(item?.ReasonTypeObj) : typeObj?.adapt({});
        
        return obj;
      }
      return new Reason();
    } catch (error) {
      console.error('Error adapting Reason object:', error);
      return new Reason();
    }
  }
}
