// src/theme.ts
import { createTheme, DEFAULT_THEME } from '@mantine/core';

export const theme = createTheme({
  ...DEFAULT_THEME,

  primaryColor: 'ocean',
  primaryShade: 7,

  fontFamily: 'EuclidSquare, ui-sans-serif, system-ui, sans-serif',
  headings: {
    fontFamily: 'EuclidSquare, ui-sans-serif, system-ui, sans-serif',
    fontWeight: '600',
  },

  /** 👇 Add custom color scales */
  colors: {
    ...DEFAULT_THEME.colors,
    ocean: [
      "#eaedf8",
      '#e4ebfb', // 0 (lightest)
      '#ccd8f7', // 1
      '#b5c6f2', // 2
      '#9eb4ee', // 3
      '#87a2ea', // 4
      '#7192E9', // 5 ← used as primaryShade,
      '#5c7ada', // 6
      '#4966ca', // 7
      '#3959b0', // 8
    ],
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
