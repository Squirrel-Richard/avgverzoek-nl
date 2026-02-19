import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#111118',
        'surface-elevated': '#1A1A24',
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        'text-primary': '#F0F0F8',
        'text-muted': '#6B7280',
        'text-faint': '#374151',
        accent: '#14b8a6',
        warning: '#f97316',
        danger: '#ef4444',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
};
export default config;
