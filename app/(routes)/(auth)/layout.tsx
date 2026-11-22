import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Container } from "~/components/shared/container";
import { LogoComponent } from "~/components/shared/logo";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-1 justify-center overflow-x-clip md:items-center">
      <Container>
        <div className="flex flex-col items-center gap-10 py-20">
          <LogoComponent className="text-[15px]" imgSize={48} />

          <div className="w-full max-w-[384px]">{children}</div>
        </div>
      </Container>
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
