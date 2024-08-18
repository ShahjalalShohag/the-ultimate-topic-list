import { extendTheme } from "@chakra-ui/react";
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};
export const colors = {
  primaryBg: {
    light: "#f0f6fc",
    dark: "#18181b",
  },
  secondaryBg: {
    light: "#e8eef4",
    dark: "#161B22",
  },
  tertiaryBg: {
    light: "#f3f8fa",
    dark: "#21262D",
  },
  fourthBg: {
    light: "#eaecef",
    dark: "#303136",
  },
  tooltipSubmenuBg: {
    light: "#e1e4e8",
    dark: "#2D333B",
  },
  textPrimary: {
    light: "#333333",
    dark: "#C9D1D9",
    neutral: "#B0A0A0",
  },
  textSecondary: {
    light: "#586069",
    dark: "#8B949E",
  },
  textTertiary: {
    light: "#6e7781",
    dark: "#6E7681",
  },
  textHeading: {
    light: "#24292f",
    dark: "#C9D1D9",
  },
  textDisabled: {
    light: "#7b8085",
    dark: "#484F58",
  },
  borderColor: {
    light: "#dbdde0",
    dark: "#30363D",
  },
  dividerColor: {
    light: "#eaecef",
    dark: "#21262D",
  },
  buttonBg: {
    light: "#c6d0da",
    dark: "#21262D",
  },
  buttonText: {
    light: "#24292f",
    dark: "#C9D1D9",
  },
  buttonHoverBg: {
    light: "#b0b8c1",
    dark: "#30363D",
  },
  buttonActiveBg: {
    light: "#dcdee0",
    dark: "#161B22",
  },
  focusBorderColor: {
    light: "#f0f6fc1a",
    dark: "#f0f6fc1a",
  },
  hoverBorderColor: {
    light: "#6e737a",
    dark: "#858585",
  },
  infoAlertBg: {
    light: "#ddf4ff",
    dark: "#1F6FEB",
  },
  successAlertBg: {
    light: "#dcffe4",
    dark: "#238636",
  },
  warningAlertBg: {
    light: "#fff5b1",
    dark: "#D29922",
  },
  errorAlertBg: {
    light: "#ffe3e6",
    dark: "#DA3633",
  },
  linkColor: {
    light: "#0366d6",
    dark: "#58A6FF",
  },
  linkHoverColor: {
    light: "#8444f3",
    dark: "#A371F7",
  },
  codeBlockBg: {
    light: "#f6f8fa",
    dark: "#161B22",
  },
  inlineCodeBg: {
    light: "#f6f8fa",
    dark: "#161B22",
  },
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    dark: "rgba(1, 4, 9, 0.5)",
  },
};

const customTheme = extendTheme({
  config,
  colors,
  fonts: {
    FontFace: "Inter",
  },
});

export default customTheme;
