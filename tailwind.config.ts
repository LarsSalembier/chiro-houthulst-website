import { heroui } from "@heroui/theme";
import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./src/**/*.tsx",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [heroui(), typography],
} satisfies Config);
