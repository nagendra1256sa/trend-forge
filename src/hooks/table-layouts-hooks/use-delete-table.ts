import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { deleteTable } from "@/lib/api/table-layout.service";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useDeleteTableById() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [tableDeleted, setTableDeleted] = useState<boolean>(false);
    const { selectedBCId } = useBusinessCenter();

    const deleteTableLayout = useCallback(async (layoutId: number, tableIds: number[]) => {
        if (!selectedBCId) {
            setError("Business Center ID not selected");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setMessage('');
            setTableDeleted(false);

            const response = await deleteTable(layoutId, tableIds, Number(selectedBCId));

            if (response?.success) {
                const count = tableIds?.length || 0;
                const msg = count > 1 ? "Tables deleted successfully" : "Table deleted successfully";
                
                setMessage(msg);
                setTableDeleted(true);
                toast.success(msg);
            } else {
                setMessage("Oops something went wrong..!");
                setTableDeleted(false);
            }
        } catch (error) {
            setError((error as Error).message);
            setMessage("Oops something went wrong..!");
            setTableDeleted(false);
        } finally {
            setLoading(false);
        }
    }, [selectedBCId]); 

    return { deleteTableLayout, error, loading, message, tableDeleted };
}
