import { ThemeProvider, createTheme } from "@mui/material";

import { DarkModeContext } from "./DarkModeContext";
import { darkModePalette } from "./DarkModeTheme";
import { lightModePalette } from "./LightModeTheme";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useMemo } from "react";

const DarkModeProvider = ({ children }: {children: React.ReactNode}) => {

  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    "isDarkMode",
    window.matchMedia("(prefers-color-scheme: dark)").matches // Default to user's OS setting
  );
  
  const mode = isDarkMode ? "dark" : "light";
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" ? lightModePalette : darkModePalette),
        },
        components: {
          MuiDialog: {
            styleOverrides: {
              paper: ({ theme }) => ({
                backgroundImage: "none",
                border: `1px solid ${theme.palette.divider}`,
              }),
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: ({ theme }) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
              }),
            },
          },
          MuiDialogActions: {
            styleOverrides: {
              root: ({ theme }) => ({
                borderTop: `1px solid ${theme.palette.divider}`,
              }),
            },
          },
        },
      }),
    [mode]
  );

  const toggleDarkMode = () => {
    setIsDarkMode((isDark: boolean) => !isDark);
  }

  return (
    <DarkModeContext.Provider value={{isDarkMode, toggleDarkMode}}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
}
export default DarkModeProvider;