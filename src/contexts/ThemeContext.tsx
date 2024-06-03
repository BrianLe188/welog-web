import { PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import { PropsWithChildren, createContext, useState } from "react";
import { green, grey, indigo } from "@mui/material/colors";

declare module "@mui/material/styles" {
    interface Theme {
        border: {
            primary: string;
            active: string;
        };
        status: {
            disabled: string;
            success: {
                primary: string;
                secondary: string;
            };
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        border?: {
            primary?: string;
            active?: string;
        };
        status?: {
            disabled?: string;
            success?: {
                primary?: string;
                secondary?: string;
            };
        };
    }
}

const initialState = {
    mode: "light",
    handleSetMode: (_mode: PaletteMode) => {},
};

const ThemeContext = createContext(initialState);

interface IThemeContextProvider extends PropsWithChildren {}

export default function ThemeContextProvider({
    children,
}: IThemeContextProvider) {
    const [mode, setMode] = useState<PaletteMode>("light");
    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: indigo[700],
            },
            secondary: {
                main: indigo[300],
            },
            text: {
                primary: indigo[900],
                secondary: indigo[200],
            },
        },
        border: {
            primary: grey[200],
            active: indigo[700],
        },
        status: {
            disabled: grey[200],
            success: {
                primary: green[700],
                secondary: green[300],
            },
        },
    });

    const handleSetMode = (mode: PaletteMode) => {
        setMode(mode);
    };

    return (
        <ThemeContext.Provider
            value={{
                mode,
                handleSetMode,
            }}
        >
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
}
