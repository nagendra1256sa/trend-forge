import LoginPage from "@/components/auth/login/login.form";
import { appConfig } from "@/config/app";
import { Metadata } from "next";
import React from "react";

export const metadata = { title: appConfig.name, description: appConfig.description } satisfies Metadata;

export default function Login(): React.JSX.Element {
  return(<>
     <LoginPage/>
  </>)
}