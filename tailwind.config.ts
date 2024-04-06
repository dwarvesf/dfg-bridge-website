import type { Config } from "tailwindcss";
import { mochiui } from "@mochi-ui/theme";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@mochi-ui/theme/dist/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {},
  plugins: [mochiui(), animate],
};
export default config;
