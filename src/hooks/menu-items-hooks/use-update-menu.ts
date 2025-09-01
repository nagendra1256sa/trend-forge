import { updateMenuItem } from "@/lib/api/menu-items.service";
import { MenuItem, MenuItemsApiErrors } from "@/models/menu-item.model";
import { UpdateMenuItem, UseMenuUpdateResult } from "@/types/menu";
import { useState, useCallback } from "react";
import { toast } from "sonner";




export const useMenuUpdate = (): UseMenuUpdateResult => {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMenuItems = useCallback(
    async (updateDetails: UpdateMenuItem, selectedId: number): Promise<void> => {
      setLoading(true);
      setError("");
      try {
        setMenuItem(null);
        const response = await updateMenuItem(updateDetails, selectedId);
        if (response.success) {
          toast.success(response.message || "Menu item updated successfully"); 
          setMenuItem(response.menuDetailsID ?? null);
        } else {
          switch (response?.message) {
            case MenuItemsApiErrors.BUSINESS_CENTER_ACTIVE: {
              setMenuItem(null);
              setError("Unable to update menu item as business center is in active state.");
              break;
            }
            default: {
              setMenuItem(null);
              setError(response.message ?? "Unknown error");
            }
          }

        }
      } catch (error: any) {
        switch (error) {
          case MenuItemsApiErrors.BUSINESS_CENTER_ACTIVE: {
            setMenuItem(null);
            setError(error.message ?? "Unknown error");
            break;
          }
          default: {
            setMenuItem(null);
            setError(error?.message ?? "Request failed");
          }
        }
      } finally {
        setLoading(false);
      }
    }, []
  );

  return { menuItem, error, loading, fetchMenuItems };
}
