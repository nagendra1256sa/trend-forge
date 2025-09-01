"use client"
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Box from "@mui/system/Box";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { loginApi } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import FormHelperText from "@mui/material/FormHelperText";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import {  Checkbox, Link, Typography } from "@mui/material";
import { useAuthContext } from "@/contexts/auth-context";
import FallbackLoader from "@/components/fallback-loader/loader";
import InputAdornment from "@mui/material/InputAdornment";
import { LockSimple  } from "@phosphor-icons/react/dist/ssr/LockSimple"; 
import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr/EnvelopeSimple';




const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
})

export type Values = zod.infer<typeof schema>;

export default function LoginPage() {
  const auth = useAuthContext();
  const [showPassword, setShowPassword] = React.useState<boolean>();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });


  // Remove local storage and cookie on navigation to login page
  useEffect(() => {
    auth.login(null);
  }, [])

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { success, loginData, message } = await loginApi(values);

      if (message) {
        setError("root", { type: "server", message: message });
        setIsPending(false);
        return;
      }
      if (success) {
        setIsPending(false);
        auth.login(loginData || null);
        redirect('/dashboard');
      }
    },
  [auth, setError]
  );


  return (
    <>
      {
        isPending && <FallbackLoader />
      }
      <Box sx={{ display: "flex", minHeight: "100vh" }}>

        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 4,
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ mb: 4 }}>
              <img src="/logo.png" alt="MarketEdge" width={180} />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Enter your email and password to access your account
            </Typography>


            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl fullWidth error={Boolean(errors.email)}>
                      <InputLabel>Email</InputLabel>
                      <OutlinedInput
                        {...field}
                        placeholder="Enter your email"
                        type="email"
                        value={field?.value || ""}
                        startAdornment={
                          <InputAdornment position="start">
                            <EnvelopeSimple size={20} />
                          </InputAdornment>
                        }
                      />
                      {errors.email && (
                        <FormHelperText>{errors.email.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                {/* Password */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormControl fullWidth error={Boolean(errors.password)}>
                      <InputLabel>Password</InputLabel>
                      <OutlinedInput
                        {...field}
                        placeholder="Enter your password"
                        value={field?.value || ""}
                        type={showPassword ? "text" : "password"}
                        startAdornment={
                          <InputAdornment position="start">
                            <LockSimple size={20} />
                          </InputAdornment>
                        }
                        endAdornment={
                          showPassword ? (
                            <EyeIcon
                              cursor="pointer"
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <EyeSlashIcon
                              cursor="pointer"
                              onClick={() => setShowPassword(true)}
                            />
                          )
                        }
                      />
                      {errors.password && (
                        <FormHelperText>{errors.password.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />


                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Checkbox size="small" />
                    <Typography variant="body2">Remember Me</Typography>
                  </Box>
                  <Link href="#" underline="hover" variant="body2">
                    Forgot Your Password?
                  </Link>
                </Box>

                <Button
                  disabled={isPending}
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ bgcolor: "#1F51FF" }}
                >
                  Log In
                </Button>
              </Stack>
            </form>
          </Container>
        </Box>

        <Box
          sx={{
            position: "relative",
            width: "50%",
            color: "white",
            px: 6,
            borderTopRightRadius: "24px",
            borderBottomRightRadius: "24px",
            backgroundImage: "url('/assets/login-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            py: 4,
          }}
        >
          <Box mt={18} width={'70%'}>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Effortlessly manage your team and operations.
            </Typography>
            <Typography variant="body1" mb={4} width={'70%'}>
              Log in to access your dashboard and manage your team.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Copyright © 2025 MarketEdge LTD.
            </Typography>

            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ fontSize: "12px", opacity: 0.7 }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>

      </Box>
    </>
  );
}

