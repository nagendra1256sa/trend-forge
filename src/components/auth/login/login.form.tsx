"use client"
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
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
import { Alert } from "@mui/material";
import { useAuthContext } from "@/contexts/auth-context";
import FallbackLoader from "@/components/fallback-loader/loader";




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
      <Box sx={{ bgcolor: "var(--mui-palette-background-level1)", p: 3, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container maxWidth="xs">
          <Card>
            <CardHeader
              title="Welcome Back"
              sx={{ textAlign: "center" }}
              titleTypographyProps={{
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            />

            <CardContent>
              <Stack spacing={3}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={2}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.email)}>
                          <InputLabel>Email address</InputLabel>
                          <OutlinedInput {...field} type="email" value={field?.value || ''} />
                          {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.password)}>
                          <InputLabel>Password</InputLabel>
                          <OutlinedInput
                            {...field}
                            value={field?.value || ''}
                            endAdornment={
                              showPassword ? (
                                <EyeIcon
                                  cursor="pointer"
                                  fontSize="var(--icon-fontSize-md)"
                                  onClick={(): void => {
                                    setShowPassword(false);
                                  }}
                                />
                              ) : (
                                <EyeSlashIcon
                                  cursor="pointer"
                                  fontSize="var(--icon-fontSize-md)"
                                  onClick={(): void => {
                                    setShowPassword(true);
                                  }}
                                />
                              )
                            }
                            type={showPassword ? "text" : "password"}
                          />
                          {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                        </FormControl>
                      )}
                    />
                    {errors.root ? <Alert color="error">{errors?.root?.message}</Alert> : null}
                    <Button disabled={isPending} type="submit" variant="contained">
                      Login
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
