import { GratuityAdapter, GratuityGraphqlAdapter } from "@/models/gratuity.model";

import {
	GratuityByIdGraphQlResponse,
	GratuityGraphQlResponse,
	GratuityResponse,
	OperationType,
} from "@/types/gratuity";

import { graphqlQuery } from "./graphql.service";
import { axiosInstances } from "./networkinstances";

export const getGratuitiesByBcId = async (bcId: number): Promise<GratuityResponse> => {
	try {
		const response = await axiosInstances?.get(`bc-products/${bcId}/gratuities`);

		if (response?.status === 200 && response?.data?.data) {
			const adapter = new GratuityAdapter();
			const adaptedData = adapter?.adapt(response?.data?.data);
			console.log("the adapted", adaptedData);
			return {
				success: true,
				data: adaptedData,
			};
		}

		return {
			success: false,
			message: "Unexpected response format",
		};
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
};

export const getGratuityByID = async (operation: OperationType, id: number): Promise<GratuityByIdGraphQlResponse> => {
	const selectDef = [
		{ ref: "ID", type: "field" },
		{ ref: "Name", type: "field" },
		{ ref: "Rate", type: "field" },
		{ ref: "MetricType", type: "field" },
		{ ref: "Code", type: "field" },
		{ ref: "Status", type: "field" },
	];
	const DETAIL_QRY = "getGratuity";
	try {
		const response = await graphqlQuery({
			operation: operation,
			params: selectDef,
			funName: DETAIL_QRY,
			id: id,
		});
		if (response?.data) {
			return {
				success: true,
				data: new GratuityGraphqlAdapter().adapt(response?.data[DETAIL_QRY]),
			};
		}

		return {
			success: false,
			message: "Oops something went wrong..!",
		};
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
};
export const getGratuity = async (operation: OperationType): Promise<GratuityGraphQlResponse> => {
	const selectDef = [
		{ ref: "ID", type: "field" },
		{ ref: "Name", type: "field" },
		{ ref: "Rate", type: "field" },
		{ ref: "MetricType", type: "field" },
		{ ref: "Code", type: "field" },
		{ ref: "Status", type: "field" },
	];

	const DETAIL_QRY = "getGratuities";

	try {
		const response = await graphqlQuery({
			operation,
			params: selectDef,
			funName: DETAIL_QRY,
		});
		const gratuities = response?.data?.getGratuities;
		if (Array.isArray(gratuities)) {
			const adapter = new GratuityGraphqlAdapter();
			const adaptedData = gratuities.map((item: any) => adapter.adapt(item));
			return {
				success: true,
				data: adaptedData,
			};
		} else {
			console.error("Expected array but got:", response.data);
			return {
				success: false,
				message: "Invalid data format received from server.",
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
};
