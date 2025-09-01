import { Adapter } from "./adapter";


export class CustomError {
  message?: string;
};

export class Response {
  data?: any;
  errors?: CustomError[];
  status?: boolean;
  edges: any;
};


export class ResponseAdapter implements Adapter<Response> {
  adapt(item: any): Response {
    const obj = new Response();
    obj.data = Object.prototype.hasOwnProperty.call(obj, "edges") ? obj["edges"] : item.data;
    obj.errors = [];
    const errorObj = new CustomErrorAdapter();
    if (item.errors) {
      for (const obj of item.errors) {
        obj.errors.push(errorObj.adapt(obj));
      }
    } else if (item.error) {
      obj.errors.push(errorObj.adapt(item.error));
    }
    return obj;
  }
}

export class CustomErrorAdapter implements Adapter<CustomError> {
  adapt(item: any): CustomError {
    const obj = new CustomError();
    obj.message = item.message;
    return obj;
  }
}
