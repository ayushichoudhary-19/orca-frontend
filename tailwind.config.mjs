export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-gradient-vertical-blue',
    'bg-gradient-horizontal-light-1',
    'bg-gradient-horizontal-light-2',
    'bg-gradient-horizontal-bold',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-vertical-blue': 'linear-gradient(to bottom, #7192E9, #4469CA)',
        'gradient-horizontal-light-1': 'linear-gradient(to right, #dae0f2, #dbe1f2)',
        'gradient-horizontal-light-2': 'linear-gradient(to right, #c8d1ea, #dbe0f1)',
        'gradient-horizontal-bold': 'linear-gradient(to right, #7d91e2, #627ed4)',
      },
    },
  },
  plugins: [typography],
};
