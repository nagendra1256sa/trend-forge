import { MenuItem } from "@/models/menu-item.model";

export interface MenuItemResponse {
    success: boolean;
    menuDetails?: MenuItem[];
    message?: string;
}

export interface GetMenuItemByIdResponse {
    success: boolean;
    menuDetailsID?: MenuItem;
    message?: string;
}
export interface MenuItemTableProps {
  rows: MenuItem[];
  onUpdateFetchList: () => void;
}

export interface MenuItemPaginationProps {
    count: number;
    page: number;
    onPageChange: (event: unknown, newPage: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface MenuEditProps {
    open: boolean;
    close:  () => void;
    menuItemData: MenuItem;
    onFetchList:()=>void;
    onUpdateId:()=>void;
}

export interface useGetMenuItemsListProps {
  menuDetails: MenuItem[];
  error: string;
   loading: boolean;
   reFetch: () => void
  setMenuDetails: Dispatch<SetStateAction<MenuItem[]>>
}

export interface UseGetMenuItemById {
  menuItem: MenuItem | null;
  loading: boolean;
  error: string;
  reFetch: () => void;
}

export interface UseMenuUpdateResult {
  menuItem: MenuItem | null;
  error: string;
  loading: boolean;
  fetchMenuItems: (updateDetails: UpdateMenuItem, selectedId: number) => Promise<void>;
}

export interface UpdateMenuItem {
  Label: string;
  BasePrice: number;
  SellingPrice: number;
  Quantity: string;
  Ingredients: string;
  Description: string;
  ExpirationDate: string;
  Instructions: string;
  CookingTime: string;
  DeclarationAllergens: string;
  RentBinNo: string;
  CourseMark: number;
  Synonyms: string;
  ProductType: number;
  Mandatory: number;
  Status: number;
}



