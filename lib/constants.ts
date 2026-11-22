import type { Route } from "next";

export type NavItemType = {
  label: string;
  mobileLabel?: string;
  path: Route;
  kind?: "nav" | "login" | "join";
  badge?: string;
};

export const navItems: NavItemType[] = [
  { label: "Home", mobileLabel: "Sanctuary", path: "/", kind: "nav" },
  { label: "About Us", mobileLabel: "Our Story", path: "/about", kind: "nav" },
  {
    label: "Project",
    mobileLabel: "Missions & Builds",
    path: "/projects",
    kind: "nav",
    badge: "Mount Zion",
  },
  {
    label: "Services & Visit",
    mobileLabel: "Gatherings & Visit",
    path: "/services",
    kind: "nav",
  },
  {
    label: "Partner",
    mobileLabel: "Kingdom Partners",
    path: "/partner",
    kind: "nav",
  },
  { label: "Login", path: "/sign-in", kind: "login" },
  { label: "Join the family", path: "/sign-up", kind: "join" },
];
