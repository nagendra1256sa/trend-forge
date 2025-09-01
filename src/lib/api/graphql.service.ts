import { ResponseAdapter } from "@/models/graphql";
import { gql } from "@apollo/client";

import { OperationType } from "@/types/gratuity";

import client from "../apollo-client";
import { getSelectQuery } from "./common.service";
import { axiosInstances } from "./networkinstances";
import { print } from "graphql/language/printer";

const adapter = new ResponseAdapter();

export async function graphqlQuery({
	operation = "R",
	params = [],
	funName = "",
	id = null,
	typeDef = "",
	variables = {},
	pagination = {},
	selectionParams = [],
}: {
	operation: OperationType;
	params?: any[];
	funName: string;
	id?: any;
	typeDef?: string;
	variables?: Record<string, any>;
	pagination?: any;
	selectionParams?: any[];
	selectionColumn?: any;
}) {
	if (!["C", "R", "U", "D", "NR"].includes(operation)) {
		throw new Error("Invalid operation");
	}

	switch (operation) {
		case "C": {
			const queryStr = getSelectQuery(selectionParams);
			const mutation = gql`
				mutation (${typeDef}) {
					${funName}(input: $postData) {
						${queryStr}
					}
				}
			`;
			const result = await client.mutate({
				mutation,
				variables: {
					postData: variables,
				},
			});
			return adapter.adapt(result);
		}

		case "U": {
			const queryStr = getSelectQuery(selectionParams);
			const mutation = gql`
				mutation ($id: ID!, ${typeDef}) {
					${funName}(id: $id, input: $postData) {
						${queryStr}
					}
				}
			`;
			const result = await client.mutate({
				mutation,
				variables: {
					id,
					postData: variables,
				},
			});
			return adapter.adapt(result);
		}

		case "R": {
			const queryStr = getSelectQuery(params);

			if (id) {
				const query = gql`
					query {
						${funName}(id: ${id}) {
							${queryStr}
						}
					}
				`;
				const result = await client.query({ query });
				return adapter.adapt(result);
			}

			// ✨ Detect when pagination is not needed
			const isPaginated = !!pagination?.pageSize;

			let query;
			let startStruct = "";
			let endStruct = "";
			let paginate = '';
			if (isPaginated) {
				// paginated version
				let sortVal = "";
				let filterVal = "";

				if (pagination?.sortArr?.length) {
					const sorts = pagination.sortArr.map((s: any) => `{sortOn:"${s.sortOn}", sortBy:"${s.sortBy}"}`).join(",");
					sortVal = `sort:[${sorts}]`;
				}

				if (pagination?.filterArr?.length) {
					const filters = pagination.filterArr
						.map((f: any) => {
							const value = f.value ? `"${f.value}"` : "null";
							const values =
								f.values && f.values.length > 0 ? `[${f.values.map((v: any) => `"${v}"`).join(",")}]` : "null";
							return `{param:"${f.param}", value:${value}, values:${values}}`;
						})
						.join(",");
					filterVal = `filter:[${filters}]`;
				}

				const cursorDirection = pagination?.before ? "before" : "after";
				paginate = `(first:${pagination.pageSize}${pagination?.cursor ? `, ${cursorDirection}:"${pagination.cursor}"` : ""
					}${sortVal ? `, ${sortVal}` : ""}${filterVal ? `, ${filterVal}` : ""})`;

				startStruct = `
      edges {
        cursor
        node {
    `;
				endStruct = `
        }
      }
      fullCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    `;

				query = gql`
					query {
					  ${funName} ${paginate} {
					    ${startStruct}
					    ${queryStr}
					    ${endStruct}
					  }
					}
				`;
			} else {
				query = gql`
					query {
					  ${funName} ${paginate} {${startStruct}\n ${queryStr} ${endStruct}\n}
					}
				`;
			}

			const result = await axiosInstances.post("/graphql", {
				query: print(query),
				variables: {},
				operationName: null,
			});
			return adapter.adapt(result);
		}

		case "NR": {
			const queryStr = getSelectQuery(params);
			const query = gql`
				query {
					${funName}(nodeId:${id}) {
						${queryStr}
					}
				}
			`;
			const result = await client.query({ query });
			return adapter.adapt(result);
		}

		default: {
			throw new Error("Operation not supported yet");
		}
	}
}