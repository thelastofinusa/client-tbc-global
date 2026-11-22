import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "~/components/reusable/shadcn/button";
import { Container } from "~/components/shared/container";
import { siteConfig } from "~/config/site.config";

async function DashboardContent() {
  await auth.protect({ unauthenticatedUrl: "/sign-in" });

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "Member";
  const primaryEmail = user.primaryEmailAddress?.emailAddress;
  const primaryPhone = user.primaryPhoneNumber?.phoneNumber;

  return (
    <div className="py-5">
      <header className="flex h-16 items-center justify-end gap-4 p-4">
        <Suspense>
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </Suspense>
      </header>

      <Container className="space-y-2">
        <h1 className="font-serif text-xl font-bold">Welcome, {fullName}</h1>
        {primaryEmail && (
          <p className="text-muted-foreground text-sm">Email: {primaryEmail}</p>
        )}
        {primaryPhone && (
          <p className="text-muted-foreground text-sm">Phone: {primaryPhone}</p>
        )}
        <p className="text-sm">{siteConfig.description}</p>
      </Container>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
