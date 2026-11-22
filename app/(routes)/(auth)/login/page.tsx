import Link from "next/link";
import { siteConfig } from "~/config/site.config";
import { getInitials } from "~/lib/utils";
import { AuthForm } from "../_components/form";

export default function Page() {
  return (
    <section className="flex flex-col items-center gap-6">
      <div className="bg-card w-full rounded-xl p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] md:p-8">
        <AuthForm type="signin" />
      </div>

      <p className="font-serif text-[13px] font-medium tracking-wide">
        New to {getInitials(siteConfig.title)} Family?{" "}
        <Link
          href="/join"
          className="text-primary font-bold underline underline-offset-2"
        >
          Join us
        </Link>
      </p>
    </section>
  );
}
