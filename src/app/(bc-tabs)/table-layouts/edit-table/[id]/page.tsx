import ManageTableDetails from "@/components/table-layouts/table-layout-manager";
import React from "react";
export default async function EditTable({params}: {params: Promise<{id: string}>}): Promise<React.JSX.Element> {
    const {id} = await params;
    return (
        <ManageTableDetails layoutId={Number.parseInt(id)} />
    );
}