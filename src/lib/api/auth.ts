import { LoginAdapter } from "@/models/login.model";

import { LoginResponse } from "@/types/login";
import { paths } from "@/paths";
import { Values } from "@/components/auth/login/login.form";

import { axiosInstances } from "./networkinstances";

export async function loginApi(loginData: Values): Promise<LoginResponse> {
	const data = new URLSearchParams();
	data.append("username", loginData.email);
	data.append("password", loginData.password);
	//pending
	data.append("grant_type", "password");
	data.append("client_id", "application");
	data.append("client_secret", "secret");
	try {
		const response = await axiosInstances.post(paths.auth.userLogin.login, data.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		if (response?.status === 200) {
			const data = response?.data; //pending
			const loginDetails = new LoginAdapter();
			return {
				success: true,
				loginData: loginDetails.adapt(data),
			};
		} else {
			return {
				success: false,
				message: "",
			};
		}
	} catch (error: any) {
		let message;
		if (error?.response?.data?.msg) {
			message = error.response.data.msg;
		} else if (error?.msg) {
			message = error.message;
		}

		return {
			success: false,
			message,
		};
	}
}
export interface ReauthRequest {
	id: number;
	password: string;
}
export interface ReauthResponse {
	success: boolean;
	message?: string;
}
interface ApiReauthResponse {
	Status: boolean;
	Msg: string;
}

export const reauthenticateFetch = async (params: ReauthRequest): Promise<ReauthResponse> => {
	try {
		const response = await axiosInstances?.post<ApiReauthResponse>(`/auth/reauthenticate`, params);

		console.log("response", response);

		return response?.status === 200 && response?.data
			? {
					success: response.data.Status,
					message: response.data.Msg,
				}
			: {
					success: false,
					message: "Unexpected response from server.",
				};
	} catch (error: any) {
		console.error("Reauthentication error:", error);
		return {
			success: false,
			message: error?.response?.data?.Msg || error?.response?.data?.message || "An error occurred.",
		};
	}
};
