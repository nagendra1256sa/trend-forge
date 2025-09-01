import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	Modal,
	OutlinedInput,
	Paper,
	Select,
	Stack,
	Typography,
	Avatar,
} from "@mui/material";
import { X, Camera as CameraIcon, Eye as EyeIcon, EyeSlash as EyeSlashIcon } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { useEmployeeDetails } from "@/hooks/employee-hooks/get-employee-by-id";
import FallbackLoader from "../fallback-loader/loader";
import { useDialog } from "@/hooks/use-dialog";
import ReAuthenticationPopUp from "./re-authentication-pop-up";
import { useUpdateEmployee } from "@/hooks/employee-hooks/use-update-employee";
import { EMPLOYEE_TITLE_OPTIONS } from "@/constants/employee";
import { Option } from "@/components/core/option";
import { useTranslation } from "react-i18next";

interface EditDetailsPopupProps {
	selectedEmployeeId: number | null;
	open: boolean;
	close: () => void;
}

interface FormData {
	title: string;
	firstName: string;
	lastName: string;
	displayName: string;
	email: string;
	contactNumber: string;
	password: string;
}

const defaultValues: FormData = {
	title: '',
	firstName: '',
	lastName: '',
	displayName: "",
	email: "",
	contactNumber: "",
	password: "",
};

const EditDetailsPopup = ({ open, close, selectedEmployeeId }: EditDetailsPopupProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isDirty },
		trigger
	} = useForm<FormData>({
		defaultValues,
		mode: "onBlur",
	});


	const { employeeDetailsByID, loading } = useEmployeeDetails(selectedEmployeeId ?? 0);
	const { handleClose, handleOpen, open: reAuthenticationOpen } = useDialog();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [avatar, setAvatar] = useState<string | undefined>();
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const { update, isLoading, isEmployeeUpdate } = useUpdateEmployee();
	const { t } = useTranslation();

	useEffect(() => {
		if (employeeDetailsByID) {
			reset({
				title: employeeDetailsByID?.title || "",
				firstName: employeeDetailsByID?.first_name || "",
				lastName: employeeDetailsByID?.last_name || "",
				displayName: employeeDetailsByID?.display_name || "",
				email: employeeDetailsByID?.email || "",
				contactNumber: employeeDetailsByID?.phone || "",
				password: employeeDetailsByID?.password || "",
			});
			setAvatar(employeeDetailsByID?.UserImage?.image || "");
		}
	}, [employeeDetailsByID, reset]);

	useEffect(()=>{
		if(isEmployeeUpdate) {
			close();
		}

	},[isEmployeeUpdate])

	

	const onSubmit =  (data: FormData) => {
		try {
			if (!selectedEmployeeId) {
				console.error("No employee selected for update");
				return;
			}

			const updateParams = {
				Title: data?.title,
				FirstName: data?.firstName,
				LastName: data?.lastName,
				DisplayName: data?.displayName,
				Email: data?.email,
				Phone: data?.contactNumber,
				Status: employeeDetailsByID?.Status,
				// password: data?.password,
				// ...(avatar && avatar !== employeeDetailsByID?.UserImage?.image && {
				// 	image: avatar,
				// }),
			};

			update(updateParams, selectedEmployeeId);
		} catch (error) {
			console.error("Error in onSubmit:", error);
		}
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatar(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleOpenPopUp = () => {
		handleOpen();
	};

	return (
		<Modal
			open={open}
			onClose={close}
			aria-labelledby="edit-employee-title"
			sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", p: 2 }}>
				<Paper
					sx={{
						width: "100%",
						maxWidth: 1000,
						p: 3,
						borderRadius: 2,
						boxShadow: 6,
						outline: "none",
						maxHeight: "90vh",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
						<Typography variant="h6" fontWeight={600}>
							{t("Employee:edit_employee")}
						</Typography>
						<Button onClick={close} color="secondary" sx={{ p: 1 }}>
							<X size={22} />
						</Button>
					</Stack>

					{
						isLoading && <FallbackLoader/>
					}

					<Box sx={{ flex: 1, overflow: "auto", px: 3, py: 2 }}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<FormControl fullWidth>
										<InputLabel shrink>{t("Employee:employee_id")}</InputLabel>
										<OutlinedInput disabled notched label={t("Employee:employee_id")} value={employeeDetailsByID?.user_id || ""} readOnly />
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.title} required>
										<InputLabel>{t("Employee:title")}</InputLabel>
										<Controller
											control={control}
											name="title"
											rules={{
												required: t("Employee:title_required") }}
											render={({ field }) => (
												<Select {...field}>
													{EMPLOYEE_TITLE_OPTIONS?.map((option) => (
														<Option key={option?.value} value={option?.value}>
															{option?.label}
														</Option>
													))}
												</Select>
											)}
										/>
										<FormHelperText>{errors.title?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.firstName} required>
										<InputLabel>{t("Employee:first_name")}</InputLabel>
										<OutlinedInput label={t("Employee:first_name")} {...register("firstName", { required: t("Employee:first_name_required")  })} onBlur={() => trigger("firstName")}/>
										<FormHelperText>{errors.firstName?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.lastName} required>
										<InputLabel>{t("Employee:last_name")}</InputLabel>
										<OutlinedInput label={t("Employee:last_name")} {...register("lastName", { required: t("Employee:last_name_required")  })} onBlur={() => trigger("lastName")}/>
										<FormHelperText>{errors.lastName?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.displayName} required>
										<InputLabel>{t("Employee:display_name")}</InputLabel>
										<OutlinedInput label={t("Employee:display_name")} {...register("displayName", { required: t("Employee:display_name_required")  })} onBlur={() => trigger("displayName")}/>
										<FormHelperText>{errors.displayName?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.email}>
										<InputLabel>{t("Employee:email")}</InputLabel>
										<OutlinedInput label={t("Employee:email")} type="email" {...register("email")} />
										<FormHelperText>{errors.email?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.contactNumber} required>
										<InputLabel>{t("Employee:contact_number")}</InputLabel>
										<OutlinedInput
											label={t("Employee:contact_number")}
											{...register("contactNumber", {
												required: t("Employee:contact_number_required"),
												pattern: {
													value: /^[0-9]{10}$/,
													message: t("Employee:invalid_phone_number"),
												},
											})}
											onBlur={() => trigger("contactNumber")}
										/>
										<FormHelperText>{errors.contactNumber?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth error={!!errors.password} required>
										<InputLabel>{t("Employee:password")}</InputLabel>
										<OutlinedInput
											label={t("Employee:password")}
											type={showPassword ? "text" : "password"}
											endAdornment={
												showPassword ? (
													<EyeIcon cursor="pointer" onClick={() => setShowPassword(false)} />
												) : (
													<EyeSlashIcon cursor="pointer" onClick={handleOpenPopUp} />
												)
											}
											{...register("password", { required: t("Employee:password_required") })}
											onBlur={() => trigger("password")}
										/>
										<FormHelperText>{errors.password?.message}</FormHelperText>
									</FormControl>
								</Grid>

								<Grid item xs={12} md={6}>
									<Stack direction="row" spacing={3} alignItems="center">
										<Box sx={{ border: "1px dashed", borderRadius: "50%", display: "inline-flex", p: "4px" }}>
											<Avatar src={avatar} sx={{ width: 100, height: 100 }}>
												<CameraIcon />
											</Avatar>
										</Box>
										<Stack spacing={1} alignItems="flex-start">
											<Typography variant="subtitle1">{t("Employee:avatar")}</Typography>
											<Typography variant="caption">{t("Employee:avatar_conditions")}</Typography>
											<Button variant="outlined" color="secondary" onClick={() => avatarInputRef.current?.click()}>
												Select
											</Button>
											<input type="file" ref={avatarInputRef} accept=".png, .jpg, .jpeg" hidden onChange={handleAvatarChange} />
										</Stack>
									</Stack>
								</Grid>
							</Grid>

							<Stack direction="row" justifyContent="flex-end" mt={4}>
								<Button onClick={close} sx={{ mr: 2 }}>
									{t("Employee:cancel")}
								</Button>
								<Button type="submit" variant="contained" disabled={!isDirty}>
									{t("Employee:update")}
								</Button>
							</Stack>
						</form>
					</Box>

					{loading && <FallbackLoader />}
					{reAuthenticationOpen && <ReAuthenticationPopUp open={reAuthenticationOpen} close={handleClose} />}
				</Paper>
			</Container>
		</Modal>
	);
};

export default EditDetailsPopup;
