import * as React from "react";
import type { Metadata, Viewport } from "next";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import "@/styles/global.css";
import "@/styles/globalStyles.scss";

import { appConfig } from "@/config/app";
import { getSettings as getPersistedSettings } from "@/lib/settings";
import { AuthenticationProvider } from "@/contexts/auth-context";
import { BusinessCenterProvider } from "@/contexts/businesscenter-context";
import { Analytics } from "@/components/core/analytics";
import { EmotionCacheProvider } from "@/components/core/emotion-cache";
import { I18nProvider } from "@/components/core/i18n-provider";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { Rtl } from "@/components/core/rtl";
import { SettingsProvider } from "@/components/core/settings/settings-context";
import { ThemeProvider } from "@/components/core/theme-provider";
import { Toaster } from "@/components/core/toaster";
import { HeaderTitleProvider } from "@/hooks/header-title";
import { EmployeeContextProvider } from "@/contexts/employee-context";

export const metadata = { title: appConfig.name } satisfies Metadata;
export const viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: appConfig.themeColor,
} satisfies Viewport;

// Define the AuthProvider based on the selected auth strategy
// Remove this block if you are not using any auth strategy



interface LayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps): Promise<React.JSX.Element> {
	const settings = await getPersistedSettings();
	const direction = settings.direction ?? appConfig.direction;
	const language = settings.language ?? appConfig.language;

	return (
		<html dir={direction} lang={language} suppressHydrationWarning>
			<body>
				<InitColorSchemeScript attribute="class" />
				<AuthenticationProvider>
					<HeaderTitleProvider>
						<EmployeeContextProvider>
							<BusinessCenterProvider>
								<Analytics>
									<LocalizationProvider>
										<SettingsProvider settings={settings}>
											<I18nProvider lng={language}>
												<EmotionCacheProvider options={{ key: "mui" }}>
													<Rtl direction={direction}>
														<ThemeProvider>
															{children}
															{/* <SettingsButton /> */}
															<Toaster position="bottom-right" />
															{/* <Footer /> */}

														</ThemeProvider>
													</Rtl>
												</EmotionCacheProvider>
											</I18nProvider>
										</SettingsProvider>
									</LocalizationProvider>
								</Analytics>
							</BusinessCenterProvider>
						</EmployeeContextProvider>
					</HeaderTitleProvider>
				</AuthenticationProvider>
			</body>
		</html>
	);
}
