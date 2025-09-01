import { LocationAdapter, TaxRuleAdapter, TaxRuleAdapterByTaxId } from "@/models/tax-rule.model";
import { TaxRuleListAdapter } from "@/models/tax-rule-list.model";
import { LocationsResponse, TaxRulesResponse, TaxRulesResponseByBcId } from "@/types/tax-rule";
import { paths } from "@/paths";
import { axiosInstances } from "./networkinstances";

export const fetchTaxRuleByBcId = async (bcId: number): Promise<TaxRulesResponseByBcId> => {
	try {
		const response = await axiosInstances?.get(paths.taxRule?.getTaxRulesByBcID(bcId));

		if (response?.status === 200 && response?.data?.data) {
			const adapter = new TaxRuleAdapter();
			const adaptedData = adapter?.adapt(response?.data?.data);
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

export const getTaxRuleByTaxId = async (id: number): Promise<TaxRulesResponseByBcId> => {
	try {
		const response = await axiosInstances?.get(paths?.taxRule?.getTaxRulesByTaxId(id));

		if (response?.status === 200 && response?.data?.data) {
			const adapter = new TaxRuleAdapterByTaxId();
			const data = {
				CategoryTaxRules: response?.data?.data,
			};
			const adaptedData = adapter?.adapt(data);
			return {
				success: true,
				data: adaptedData,
			};
		}

		return {
			success: false,
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

export const getLocations = async (): Promise<LocationsResponse> => {
	try {
		const response = await axiosInstances?.get(paths?.locations?.getLocations);

		if (response?.status === 200 && response?.data?.data) {
			const adapter = new LocationAdapter();
			const locations = (response?.data?.data as any[])?.map((location) => adapter?.adapt(location));
			return {
				success: true,
				locations: locations,
			};
		}

		return {
			success: false,
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

export const fetchTaxRules = async (): Promise<TaxRulesResponse> => {
	try {
		const response = await axiosInstances?.get(paths.taxRule?.getTaxRules());

		if (response?.status === 200 && response?.data?.data) {
			const adapter = new TaxRuleListAdapter();
			const adaptedData = response.data.data.map((item: any) => adapter.adapt(item));
			return {
				success: true,
				data: adaptedData,
			};
		}

		return {
			success: false,
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
