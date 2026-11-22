import { auth } from "@clerk/nextjs/server";
import { Image } from "keltra/image/next";
import { CalendarDaysIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Eyebrow } from "~/components/shared/eyebrow";
import { LogoComponent } from "~/components/shared/logo";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Brand panel (desktop only) */}
      <aside className="bg-navy relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/hero.avif"
          alt=""
          fill
          loading="eager"
          className="pointer-events-none object-cover object-[58%_center]"
        />
        <div
          aria-hidden="true"
          className="from-navy via-navy/60 to-navy/30 pointer-events-none absolute inset-0 bg-linear-to-t"
        />

        <div className="relative z-10 p-10 xl:p-14">
          <LogoComponent path="/" className="w-max text-[15px]" imgSize={48} />
        </div>

        <div className="relative z-10 p-10 xl:p-14">
          <Eyebrow label="Welcome to the family" />
          <h2 className="mt-5 max-w-md font-serif text-5xl leading-[1.02] font-extrabold tracking-[-0.06em] xl:text-6xl">
            A generation
            <br />
            set on <span className="text-accent">fire.</span>
          </h2>
          <p className="text-secondary/80 mt-5 max-w-sm text-sm leading-[1.75]">
            Register to stay connected, check in at services, and find your
            place to serve.
          </p>

          <div className="mt-8 flex items-center gap-2 border-t border-white/15 pt-5 text-xs text-white/80">
            <CalendarDaysIcon size={14} className="text-accent" />
            <span>
              Next gathering:{" "}
              <strong className="font-semibold text-white">
                Sunday · 9:00 AM
              </strong>{" "}
              · Kudenda, Kaduna
            </span>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="sm:bg-card flex flex-1 flex-col justify-center overflow-x-clip px-5 py-12 sm:px-10">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-10">
          <LogoComponent
            path="/"
            className="text-[15px] lg:hidden"
            imgSize={44}
          />
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
