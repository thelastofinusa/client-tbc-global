import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Spinner } from "~/components/reusable/shadcn/spinner";

export default function SSOCallbackPage() {
  return (
    <div className="grid min-h-svh place-items-center">
      <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm">
        <Spinner className="text-primary size-6" />
        <p>Signing you in…</p>
      </div>

      <AuthenticateWithRedirectCallback
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        continueSignUpUrl="/sign-up"
        firstFactorUrl="/sign-in"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
