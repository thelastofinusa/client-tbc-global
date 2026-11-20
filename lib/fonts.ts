import { cn } from "cn";
import {
  Geist_Mono as FontMono,
  Geist as FontSans,
  Inter as FontSerif,
} from "next/font/google";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const fontSerif = FontSerif({
  variable: "--font-serif",
  subsets: ["latin"],
});

const fontMono = FontMono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const fontVariables = (className: string) =>
  cn(className, fontSans.variable, fontSerif.variable, fontMono.variable);
