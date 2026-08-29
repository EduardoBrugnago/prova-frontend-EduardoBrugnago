import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import Colors from './colors';
import fonts from './fonts';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    ssm: true;
    xxl: true;
  }
}

const breakpointValues = {
  xs: 0,
  ssm: 460,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1600,
  xxl: 1920,
};

export interface ThemeColors {
  primaryColor: string;
  primaryLightColor: string;
  primaryDarkColor: string;
  secondaryColor: string;
  backgroundColor: string;
  paperColor: string;
  paperAltColor: string;
  borderColor: string;
  dividerColor: string;
  inputBackgroundColor: string;
  backgroundDisabled: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  textDisabledColor: string;
  contrastTextColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
}

export const defaultColors: ThemeColors = {
  primaryColor: Colors.blue,
  primaryLightColor: Colors.blueLight,
  primaryDarkColor: Colors.blueDark,
  secondaryColor: Colors.teal,
  backgroundColor: Colors.background,
  paperColor: Colors.paper,
  paperAltColor: Colors.white,
  borderColor: Colors.border,
  dividerColor: Colors.divider,
  inputBackgroundColor: Colors.inputGray,
  backgroundDisabled: Colors.disabled,
  textPrimaryColor: Colors.ink,
  textSecondaryColor: Colors.inkSecondary,
  textDisabledColor: Colors.inkDisabled,
  contrastTextColor: Colors.white,
  successColor: Colors.green,
  warningColor: Colors.amber,
  errorColor: Colors.red,
  infoColor: Colors.cyan,
};

export function createAppTheme(themeColors: ThemeColors): Theme {
  const {
    primaryColor,
    primaryLightColor,
    primaryDarkColor,
    secondaryColor,
    backgroundColor,
    paperColor,
    paperAltColor,
    borderColor,
    dividerColor,
    inputBackgroundColor,
    backgroundDisabled,
    textPrimaryColor,
    textSecondaryColor,
    textDisabledColor,
    contrastTextColor,
    successColor,
    warningColor,
    errorColor,
    infoColor,
  } = themeColors;

  return createTheme({
    breakpoints: { values: breakpointValues },

    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        light: primaryLightColor,
        dark: primaryDarkColor,
        contrastText: contrastTextColor,
      },
      secondary: { main: secondaryColor, contrastText: contrastTextColor },
      success: { main: successColor, contrastText: contrastTextColor },
      warning: { main: warningColor, contrastText: contrastTextColor },
      error: { main: errorColor, contrastText: contrastTextColor },
      info: { main: infoColor, contrastText: contrastTextColor },
      text: {
        primary: textPrimaryColor,
        secondary: textSecondaryColor,
        disabled: textDisabledColor,
      },
      background: { default: backgroundColor, paper: paperColor },
      divider: dividerColor,
      action: {
        hover: alpha(primaryColor, 0.06),
        selected: alpha(primaryColor, 0.12),
        focus: alpha(primaryColor, 0.12),
        disabled: textDisabledColor,
        disabledBackground: backgroundDisabled,
      },
    },

    shape: { borderRadius: 8 },

    typography: {
      fontFamily: fonts.family,
      fontWeightLight: fonts.weights.light,
      fontWeightRegular: fonts.weights.regular,
      fontWeightMedium: fonts.weights.medium,
      fontWeightBold: fonts.weights.bold,
      h1: { fontSize: fonts.sizes.extraLarge, fontWeight: fonts.weights.bold, lineHeight: 1.2 },
      h2: { fontSize: fonts.sizes.larger, fontWeight: fonts.weights.bold, lineHeight: 1.25 },
      h3: { fontSize: fonts.sizes.large, fontWeight: fonts.weights.semibold, lineHeight: 1.3 },
      h4: { fontSize: fonts.sizes.medium, fontWeight: fonts.weights.semibold, lineHeight: 1.35 },
      h5: { fontSize: fonts.sizes.regular, fontWeight: fonts.weights.semibold, lineHeight: 1.4 },
      h6: { fontSize: fonts.sizes.small, fontWeight: fonts.weights.semibold, lineHeight: 1.4 },
      subtitle1: { fontSize: fonts.sizes.regular, fontWeight: fonts.weights.medium },
      subtitle2: { fontSize: fonts.sizes.small, fontWeight: fonts.weights.medium },
      body1: { fontSize: fonts.sizes.regular, lineHeight: 1.5 },
      body2: { fontSize: fonts.sizes.small, lineHeight: 1.5 },
      caption: { fontSize: fonts.sizes.smaller, color: textSecondaryColor },
      overline: {
        fontSize: fonts.sizes.extraSmall,
        fontWeight: fonts.weights.semibold,
        letterSpacing: '0.08em',
      },
      button: {
        fontSize: fonts.sizes.small,
        fontWeight: fonts.weights.semibold,
        textTransform: 'none',
      },
    },

    focusVisible: true,
    motion: { reducedMotion: 'system' },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor, color: textPrimaryColor },
          '#root': { minHeight: '100vh' },
        },
      },

      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { border: `1px solid ${borderColor}` } },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { paddingInline: 16 } },
      },

      MuiTextField: {
        defaultProps: { size: 'small', variant: 'outlined' },
      },

      MuiOutlinedInput: {
        styleOverrides: { root: { backgroundColor: inputBackgroundColor } },
      },

      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: dividerColor },
          head: {
            backgroundColor: paperAltColor,
            color: textSecondaryColor,
            fontWeight: fonts.weights.semibold,
            whiteSpace: 'nowrap',
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: { root: { border: `1px solid ${borderColor}`, borderRadius: 8 } },
      },

      MuiLinearProgress: {
        styleOverrides: { root: { height: 3 } },
      },

      MuiSkeleton: {
        defaultProps: { animation: 'wave' },
      },

      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 12 } },
      },

      MuiTooltip: {
        defaultProps: { arrow: true },
      },

      MuiChip: {
        styleOverrides: { root: { borderRadius: 6, fontWeight: fonts.weights.medium } },
      },

      MuiAlert: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
    },
  });
}

const Light = createAppTheme(defaultColors);

const Themes = {
  Light: responsiveFontSizes(Light),
};

export default Themes;
