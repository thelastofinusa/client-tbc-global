import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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
    <div className="flex-1 overflow-x-clip">
      <div className="space-y-2">
        <h1 className="font-serif text-xl font-bold">Welcome, {fullName}</h1>
        {primaryEmail && (
          <p className="text-muted-foreground text-sm">Email: {primaryEmail}</p>
        )}
        {primaryPhone && (
          <p className="text-muted-foreground text-sm">Phone: {primaryPhone}</p>
        )}
        <p className="text-sm">{siteConfig.description}</p>
      </div>
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
