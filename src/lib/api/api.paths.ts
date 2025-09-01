export const apiUrlPaths = {
	dashboard: {
       getReports: `organisation-hierarchy/dashboard-route`,
	},
	auth: {
		userLogin:{
			login:"/auth/login",
		},
	},
	taxRule: {
      getTaxRules : (bcId: number) => `bc-products/${bcId}/taxrules`,
	  getTaxRulesByTaxId: (taxId: number) => `tax-rules/${taxId}`,
	},
	locations: {
		getLocations: 'tax-rules/locations'
	},
    tableLayout : {
        getLayouts : (bcId: number) => `bc-tables/layout-list/${bcId}`,
		getTables : (bcId: number) => `bc-tables/list/${bcId}`,
		updateTable: (tableId: number, layoutId: number | string) => `bc-tables/layout/${tableId}/table/${layoutId}`,
		createTable: (layoutId: number) => `bc-tables/layout/${layoutId}`,
		deleteTable: (layoutId: number) => `bc-tables/layout/${layoutId}`,
		addNewSection: () => `bc-tables/layout`
    },
	pdf: { invoice: (invoiceId: string) => `/pdf/invoices/${invoiceId}` },
	ordertypes:'/order-type',
	order:'/order',
	employee : {
		getEmployeeList : 'user/getAssignedEmployees/',
		getEmployeeCount: '/user/getAssignedEmployeesCount/',
		inactivateEmployee : 'user/employee/inactivate',
		getUnassignedEmployees:"user/getUnassignedEmployees/",
		assignEmployee:"user/employee/assign",
		getAssignedEmployeeCount: '/user/getUnassignedEmployeesCount/',
		bulkRemoveEmployee: "user/employee/bulkRemoveEmployees",
		exportEmployees:"user/employee/getExportAssigned",
	}
	// orders:{
	// 		list: "/orders",
	// 		create: "/orders/create",
	// 		preview: (orderId: string) => `/orders?previewId=${orderId}`,
	// 		details: (orderId: string) => `/orders/${orderId}`,
	// 	}, 
} as const;
