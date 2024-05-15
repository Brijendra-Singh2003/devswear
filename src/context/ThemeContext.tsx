"use client";

import { cn } from "@/lib/utils";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type Theme = "light" | "dark";

type Data = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
};

type props = {
  children: ReactNode;
  className: string;
};

export const ThemeContext = createContext<Data>({
  theme: "light",
  setTheme() {},
});

export default function ThemeContextProvider({ children, className }: props) {
  const [theme, setTheme] = useState<Theme>("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Body className={className}>{children}</Body>
    </ThemeContext.Provider>
  );
}

function Body({ children, className }: props) {
  const { theme } = useContext(ThemeContext);
  return (
    <body
      className={cn(
        "min-h-screen min-w-80 bg-background font-sans antialiased",
        theme,
        className
      )}
    >
      {children}
    </body>
  );
}
