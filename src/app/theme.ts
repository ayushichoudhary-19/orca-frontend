import { createTheme, DEFAULT_THEME } from '@mantine/core';

export const theme = createTheme({
  ...DEFAULT_THEME,

  primaryColor: 'primary',
  primaryShade: 5,

  fontFamily: "Urbanist, ui-sans-serif, system-ui, sans-serif",
  headings: {
    fontFamily: "Urbanist, ui-sans-serif, system-ui, sans-serif",
    fontWeight: "600",
  },

  colors: {
    ...DEFAULT_THEME.colors,
    primary: [
      "#E8E4FF",
      '#D5CFFF',
      '#C2BFFF',
      '#AFA4FF',
      '#B0A4FD',
      '#6D57FC',
      '#5E47F7',
      '#4F38F2',
      '#4029EE',
      '#261E58',
      '#0C0A1C',
    ],
  },
});
