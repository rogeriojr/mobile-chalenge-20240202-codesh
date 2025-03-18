/**
 * Theme configuration for the application
 */

export const theme = {
  colors: {
    primary: '#6200EE',
    primaryDark: '#3700B3',
    secondary: '#03DAC6',
    secondaryDark: '#018786',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#B00020',
    errorLight: 'transparent',
    text: '#000000',
    textSecondary: '#757575',
    disabled: '#BDBDBD',
    divider: '#E0E0E0',
    favorite: '#FF4081',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System-Medium',
      bold: 'System-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

/**
 * Type definitions for the theme
 */
export type Theme = typeof theme;