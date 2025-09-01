import { MenuItemClient } from "@/components/menu-items/menu-item-client";
import React from "react";

interface PageProps {
  searchParams: Promise<{
    name?: string;
	sku?: string;
  }>;
}


const page: React.FC<PageProps> = async ({ searchParams }: PageProps): Promise<React.JSX.Element> => {
	 const { name, sku } = await searchParams;
	return (
		<React.Fragment>
			<MenuItemClient name={name} sku={sku}/>
		</React.Fragment>
	);
};

export default page;
