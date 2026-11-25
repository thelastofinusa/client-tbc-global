import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "~/config/site.config";
import { navItemsData } from "~/lib/constants";
import { getInitials } from "~/lib/utils";
import { AuthForm } from "../_components/form";

const navItem = navItemsData("/sign-in");

export const metadata: Metadata = {
  title: navItem?.mobileLabel,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function Page() {
  return (
    <section className="flex flex-col gap-8">
      <AuthForm type="signin" />

      <p className="border-line text-muted-foreground border-t pt-6 text-sm">
        New to {getInitials(siteConfig.title)} Family?{" "}
        <Link
          href="/sign-up"
          className="text-primary font-bold underline underline-offset-2"
        >
          Join us
        </Link>
      </p>
    </section>
  );
}
