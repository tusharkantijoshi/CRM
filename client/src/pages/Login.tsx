import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios"; // Keep axios import for isAxiosError
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormInputs) =>
      apiClient.post("/public/login", data),
    onSuccess: (response) => {
      // Use auth context to set user and store token
      login(response.data.token, {
        email: response.data.user.email,
        role: response.data.user.role,
      });

      console.log("Login successful:", response.data);
      // Navigate to home or dashboard
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setServerError(error.response.data.message || "Login failed");
      } else {
        setServerError("An unexpected error occurred");
      }
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    setServerError(null);
    mutation.mutate(data);
  };

  const isSubmitting = mutation.isPending;

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
