import { Kanit, Roboto } from "next/font/google";

/** Display / heading typeface used across the template. */
export const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

/** Body typeface. */
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});
