import { cn } from "cn";
import localFont from "next/font/local";

const fontSans = localFont({
  src: [
    {
      path: "../public/fonts/Sansation/Sansation-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Sansation/Sansation-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Sansation/Sansation-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Sansation/Sansation-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Sansation/Sansation-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Sansation/Sansation-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = localFont({
  src: [
    {
      path: "../public/fonts/CormorantUpright/CormorantUpright-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantUpright/CormorantUpright-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantUpright/CormorantUpright-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantUpright/CormorantUpright-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantUpright/CormorantUpright-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = localFont({
  src: "../public/fonts/JetBrainsMono/JetBrainsMono-VariableFont_wght.ttf",
  variable: "--font-mono",
  display: "swap",
  style: "normal",
});

export const fontVariables = (className?: string) =>
  cn(fontSans.variable, fontSerif.variable, fontMono.variable, className);
