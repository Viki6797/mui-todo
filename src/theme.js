import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#88BAB9",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f7f9fb",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
    },
  });
