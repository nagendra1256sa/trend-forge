import { useCallback, useState } from "react";

import { EmployeeByIdGraphQlResponse } from "@/types/employee";
import { updateEmployee } from "@/lib/api/employee.service";

type UseUpdateEmployeeReturn = {
	update: (params: any, id: number) => Promise<void>;
	isLoading: boolean;
	error: string | null;
	response: EmployeeByIdGraphQlResponse | null;
	reset: () => void;
	isEmployeeUpdate:boolean;
};

export const useUpdateEmployee = (): UseUpdateEmployeeReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [response, setResponse] = useState<EmployeeByIdGraphQlResponse | null>(null);
	const [isEmployeeUpdate, setIsEmployeeUpdate] = useState<boolean>(false);

	const update = useCallback(async (params: any, id: number) => {
		setIsLoading(true);
		setError(null);
		setIsEmployeeUpdate(false);

		try {
			const res: EmployeeByIdGraphQlResponse = await updateEmployee(params, id);
			if (res.success) {
				setResponse(res);
				setIsEmployeeUpdate(true);
			}

			if (!res.success) {
				setError(res.message ?? "Failed to update employee.");
			}
		} catch (error: any) {
			const message = error?.message || "Something went wrong.";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const reset = () => {
		setError(null);
		setResponse(null);
		setIsLoading(false);
	};

	return { update, isLoading, error, response, reset, isEmployeeUpdate };
};
