import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { getMenuDetails, getMenuItemByID } from "@/lib/api/menu-items.service";
import { MenuItem } from "@/models/menu-item.model";
import { GetMenuItemByIdResponse, UseGetMenuItemById, useGetMenuItemsListProps } from "@/types/menu";
import { useCallback, useEffect, useState } from "react"



export const useGetMenuItemsList = (): useGetMenuItemsListProps => {
  const [menuDetails, setMenuDetails] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {selectedBCId} = useBusinessCenter()
  const fetchMenuItems = async(): Promise<void> => {
    if(selectedBCId === null || selectedBCId === undefined)return;
    setLoading(true);
      try{
        const response = await getMenuDetails(Number(selectedBCId));
        if(response.success) {
            setMenuDetails(response?.menuDetails ? response?.menuDetails: []);
        } else {
            setMenuDetails([]);
            setError(response?.message? response?.message : '');
        }
      } catch(error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
   }
  useEffect((): void=> {
     fetchMenuItems();
  },[selectedBCId])

    const reFetch = useCallback(() => {
         fetchMenuItems();
      }, [selectedBCId]);

   return {menuDetails, error, loading, reFetch, setMenuDetails};

} 
export const useGetMenuItemById = (menuId: number): UseGetMenuItemById => {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchMenuItemById = async () => {
   setLoading(true);
    try {
      //Todo : need to add type add optional chain
      const response :GetMenuItemByIdResponse = await getMenuItemByID(menuId);
       setMenuItem(null);
      if (response?.success && response?.menuDetailsID) {
        setMenuItem(response?.menuDetailsID);
      } else {
        setError(response?.message || "Failed to fetch menu item");
        setMenuItem(null);
      }
    } catch (error: any) {
      setError(error?.message || "An unknown error occurred");
      setMenuItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (menuId) {
      setMenuItem(null)
      fetchMenuItemById();
    }
  }, [menuId]);

  const reFetch = useCallback(() => {
     fetchMenuItemById();
  }, [menuId]);

  return { menuItem, loading, error, reFetch };
};