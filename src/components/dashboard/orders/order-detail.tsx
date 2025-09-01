"use client";

import React, { useEffect, useState } from "react";
import {
	Modal,
	Box,
	Typography,
	Divider,
	IconButton,
	Stack,
} from "@mui/material";
import { useOrderDetail } from "@/hooks/use-order-detail";
import { CheckSummary, WrapCartData } from "@/models/order.model";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import FallbackLoader from "@/components/fallback-loader/loader";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { toast } from "sonner";

export interface OrderDetailModalProps {
	open: boolean;
	close: () => void;
	id: number;
}

export function OrderDetailModal({ open, close, id }: OrderDetailModalProps): React.JSX.Element {
	const { t } = useTranslation();
	const { orderDetail, loading ,error } = useOrderDetail(id);
	const [groupedCartItems, setGroupedCartItems] = useState<WrapCartData[]>([]);

	useEffect(() => {
		if (orderDetail) {
			const grouped = WrapCartData.getCartWithCondiments(orderDetail);
			setGroupedCartItems(grouped);
		}
	}, [orderDetail]);
	useEffect(()=>{
		if(error){
			toast.error(error);
		}
	},[error])
	return (
		<>
			{loading && <FallbackLoader />}

			<Modal
				open={open}
				onClose={close}
				aria-labelledby="order-title"
				aria-describedby="order-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 3,
						borderRadius: 2,
						width: 500,

					}}
				>
					<Box >
						<Stack direction="column" justifyContent="space-between" alignItems="flex-end">
							<IconButton onClick={close}>
								<XIcon />
							</IconButton>
						</Stack>
						<Stack direction="column" justifyContent="space-between" alignItems="center">
							<Typography variant="h5" fontWeight={400}>
								{t("Order:check_no")} {orderDetail?.checkNumber ?? "-"}
							</Typography>
							<Typography variant="body2" color="green" sx={{ mb: 2 }} className="text-center">
								{orderDetail?.createdAt ? dayjs(orderDetail?.createdAt).format("MMM DD, YYYY hh:mm A") : "-"}
							</Typography>
						</Stack>
						{
							orderDetail?.orderTypeObj?.label && orderDetail?.orderTypeObj?.externalId && (
								<Typography sx={{ mb: 2 }}>
									{orderDetail?.orderTypeObj?.label ?? "-"} | {orderDetail?.orderTypeObj?.externalId ?? "-"}
								</Typography>
							)
						}</Box>
					<Box sx={{
						maxHeight: '65vh',
						overflowY: 'auto',
						outline: 'none',
					}}>
						{groupedCartItems?.length > 0 ? (
							<React.Fragment key={orderDetail?.id}>
								<Typography variant="subtitle2" fontWeight={600}>
									{t("Order:items_summary")}
								</Typography>

								{groupedCartItems?.map((item: WrapCartData, index: number) => (
									<React.Fragment key={index}>
										<Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
											<Stack sx={{minWidth: "60%"}}>
												<Typography>{item?.name}</Typography>
												<div><Typography variant="caption">{item?.cartItems?.[0]?.condimentsDisplay}</Typography></div>
											</Stack>
											<Stack sx={{minWidth: "15%", textAlign: "right"}}>
												<Typography>
													{item?.quantity} </Typography>
											</Stack>
											<Stack sx={{minWidth: "25%",textAlign: "right"}}>
												<Typography>
													${Number(item?.price ?? 0).toFixed(2)}
												</Typography>
											</Stack>
										</Stack>
										<Divider sx={{ margin: "8px 0 12px 0" }} />
									</React.Fragment>
								))}
							</React.Fragment>
						) : (
							<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
								{t("Order:no_items_found")}
							</Typography>
						)}

						{groupedCartItems?.length > 0 && (
							<>
								{/* <Divider sx={{ my: 2 }} /> */}
								<Typography variant="subtitle2" fontWeight={600} sx={{ marginTop: "20px" }}>
									{t("Order:payment_summary")}
								</Typography>

								{Array.isArray(orderDetail?.checkSummary) && orderDetail.checkSummary.map((payment: CheckSummary, index: number) => {
									if (payment?.key === "grand_total") {
										return (
											<div key={index}>
												<Divider sx={{ my: 2 }} />
												<Stack direction="row" justifyContent="space-between">
													<Typography fontWeight="bold">{t("Order:grand_total")}</Typography>
													<Typography fontWeight="bold">
														${payment.value?.toFixed(2)}
													</Typography>
												</Stack>
											</div>
										);
									}

									return (
										<SummaryRow
											key={index}
											label={t(`Order:${payment?.key}`, {
												defaultValue: payment?.key,
											})}
											value={payment?.value}
										/>
									);
								})}
							</>
						)}
					</Box>
				</Box>
			</Modal>
		</>
	);

}

function SummaryRow({ label, value }: { label: string; value: number | undefined }) {
	return (
		<Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
			<Typography>{label}</Typography>
			<Typography>${value?.toFixed(2)}</Typography>
		</Stack>
	);
}
