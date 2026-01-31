import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 120,
              color: "error.main",
              mb: 3,
            }}
          />
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontSize: "4rem", fontWeight: "bold" }}
          >
            404
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            color="text.secondary"
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 4 }}
            color="text.secondary"
          >
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHome}
              size="large"
            >
              Go to Dashboard
            </Button>
            <Button variant="outlined" onClick={handleGoBack} size="large">
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
