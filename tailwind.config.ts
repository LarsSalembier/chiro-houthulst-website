import { nextui } from "@nextui-org/theme";
import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [nextui(), typography],
} satisfies Config;
