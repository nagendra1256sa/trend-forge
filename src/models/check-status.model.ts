import { CheckStatus } from "@/types/order.constants";
import { Adapter } from "./adapter";


export class CheckStatusType {
    key!: string;
    value!: string;
}

export class ChekStatusAdapter implements Adapter<CheckStatusType> {
    adapt(data: any): CheckStatusType {
        const checkStatus = new CheckStatusType();
        try {

            checkStatus.key = data?.key;
            checkStatus.value = CheckStatus?.[data?.key as keyof typeof CheckStatus];

        } catch (error) {
            console.log(error);
        }

        return checkStatus;
    }

}