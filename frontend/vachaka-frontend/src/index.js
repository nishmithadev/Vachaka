import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4f46e5" }, // indigo
    secondary: { main: "#10b981" }, // emerald
  },
  shape: { borderRadius: 14 },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
