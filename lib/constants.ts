import type { Route } from "next";

export type NavItemType = {
  label: string;
  mobileLabel?: string;
  path: Route;
  kind: "nav" | "login" | "join";
  description?: string;
  alternates?: {
    canonical?: string;
  };
};

export const navItems: NavItemType[] = [
  {
    label: "Home",
    mobileLabel: "Sanctuary",
    path: "/",
    kind: "nav",
    description:
      "Welcome to The Burning Church Global — a family built on Christ, the Word, prayer, fellowship, and purposeful service.",
    alternates: { canonical: "/" },
  },
  {
    label: "About Us",
    mobileLabel: "Our Story",
    path: "/about",
    kind: "nav",
    description:
      "Discover our vision, house culture, and seven core pillars — Christ-centeredness, the Word, prayer, fellowship, commitment, service, and growth.",
    alternates: { canonical: "/about" },
  },
  {
    label: "Projects",
    mobileLabel: "Missions & Builds",
    path: "/projects",
    kind: "nav",
    description:
      "Explore ongoing kingdom initiatives, community outreach, and building projects across The Burning Church Global.",
    alternates: { canonical: "/projects" },
  },
  {
    label: "Services & Visit",
    mobileLabel: "Gatherings & Visit",
    path: "/services",
    kind: "nav",
    description:
      "View weekly services, house culture, and ministry expressions including School of Destiny, School Invasion, ITYAC, Sound & Beyond, 3 Nights of Mercy, and Campus Fellowship Minna.",
    alternates: { canonical: "/services" },
  },
  {
    label: "Partner",
    mobileLabel: "Kingdom Partners",
    path: "/partner",
    kind: "nav",
    description:
      "Partner with The Burning Church Global through prayer, service, and giving to advance kingdom missions and projects.",
    alternates: { canonical: "/partner" },
  },
  {
    label: "Login",
    path: "/sign-in",
    kind: "login",
    description: "Sign in to your The Burning Church Global member account.",
    alternates: { canonical: "/sign-in" },
  },
  {
    label: "Join the family",
    path: "/sign-up",
    kind: "join",
    description: "Register as a member of The Burning Church Global.",
    alternates: { canonical: "/sign-up" },
  },
];

export const navItemsData = (pathname: Route) =>
  navItems.find((item) => item.path === pathname);
