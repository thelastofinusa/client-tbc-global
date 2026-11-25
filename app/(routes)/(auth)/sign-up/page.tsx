import type { Metadata } from "next";
import Link from "next/link";
import { navItemsData } from "~/lib/constants";
import { AuthForm } from "../_components/form";

const navItem = navItemsData("/sign-up");

export const metadata: Metadata = {
  title: navItem?.label,
  description: navItem?.description,
  alternates: navItem?.alternates,
};

export default function Page() {
  return (
    <section className="flex flex-col gap-8">
      <AuthForm type="signup" />

      <p className="border-line text-muted-foreground border-t pt-6 text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary font-bold underline underline-offset-2"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
