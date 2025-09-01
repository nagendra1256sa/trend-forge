import type * as React from "react";
import type { Metadata } from "next";

import { appConfig } from "@/config/app";
import { redirect } from "next/navigation";

export const metadata = { title: appConfig.name, description: appConfig.description } satisfies Metadata;

export default function Page(): React.JSX.Element {

	redirect('/auth/login');
}
