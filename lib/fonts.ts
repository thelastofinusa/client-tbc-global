import { cn } from "cn";
import {
  Geist_Mono as FontMono,
  // Hanken_Grotesk as FontSans,
  Noto_Sans as FontSans,
  Manrope as FontSerif,
} from "next/font/google";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const fontSerif = FontSerif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: "normal",
});

const fontMono = FontMono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  style: "normal",
});

export const fontVariables = (className?: string) =>
  cn(fontSans.variable, fontSerif.variable, fontMono.variable, className);
