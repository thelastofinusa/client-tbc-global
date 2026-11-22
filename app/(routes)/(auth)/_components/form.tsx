"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLock } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi2";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { MdOutlineAlternateEmail } from "react-icons/md";
import * as z from "zod";
import { Button } from "~/components/reusable/shadcn/button";
import {
  Field,
  FieldError,
  FieldGroup,
} from "~/components/reusable/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/reusable/shadcn/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/reusable/shadcn/input-otp";
import { Separator } from "~/components/reusable/shadcn/separator";
import { Eyebrow } from "~/components/shared/eyebrow";

const signUpSchema = z.object({
  firstName: z
    .string()
    .max(50, "First name must be at most 50 characters.")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .max(50, "Last name must be at most 50 characters.")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

const copyByType: Record<
  "signin" | "signup",
  { eyebrow: string; title: string; description: string; submitLabel: string }
> = {
  signup: {
    eyebrow: "Create an account",
    title: "Join the Family",
    description: "Register to stay connected and check in.",
    submitLabel: "Complete Registration",
  },
  signin: {
    eyebrow: "Account access",
    title: "Sign in to your space",
    description: "Sign in to access your profile and check in.",
    submitLabel: "Access My Profile",
  },
};

function formatClerkError(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    const e = err as { longMessage?: string; message?: string };
    if (e.longMessage || e.message) {
      return e.longMessage ?? e.message ?? "Authentication failed.";
    }
  }
  return "Something went wrong. Please try again.";
}

function isRateLimitMessage(message: string | null | undefined): boolean {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("too many verification code requests") ||
    normalized.includes("too many requests") ||
    normalized.includes("rate limit")
  );
}

export const AuthForm: React.FC<{ type: "signin" | "signup" }> = ({ type }) => {
  const router = useRouter();
  const copy = copyByType[type];

  const {
    signIn,
    errors: signInErrors,
    fetchStatus: signInFetchStatus,
  } = useSignIn();
  const {
    signUp,
    errors: signUpErrors,
    fetchStatus: signUpFetchStatus,
  } = useSignUp();

  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = React.useState(false);

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [resendCooldown, setResendCooldown] = React.useState(0);

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const navigateToDashboard = React.useCallback(
    async ({ decorateUrl }: { decorateUrl: (url: string) => string }) => {
      const url = decorateUrl("/dashboard");
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.push(url as Route);
        router.refresh();
      }
    },
    [router],
  );

  function applyClerkError(err: unknown) {
    const formatted = formatClerkError(err);
    setAuthError(formatted);
    if (isRateLimitMessage(formatted)) {
      setIsRateLimited(true);
    }
  }

  async function onSignInSubmit(data: SignInFormValues) {
    setAuthError(null);
    setResendMessage(null);
    if (!signIn) return;

    const { error } = await signIn.password({
      emailAddress: data.email.trim(),
      password: data.password,
    });

    if (error) {
      applyClerkError(error);
      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({
        navigate: navigateToDashboard,
      });
      if (finalizeError) {
        applyClerkError(finalizeError);
      }
    } else {
      setAuthError("Additional verification is required to sign in.");
    }
  }

  async function onSignUpSubmit(data: SignUpFormValues) {
    setAuthError(null);
    setResendMessage(null);
    if (!signUp) return;

    const { error } = await signUp.password({
      emailAddress: data.email.trim(),
      password: data.password,
      ...(data.firstName?.trim() ? { firstName: data.firstName.trim() } : {}),
      ...(data.lastName?.trim() ? { lastName: data.lastName.trim() } : {}),
    });

    if (error) {
      applyClerkError(error);
      return;
    }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize({
        navigate: navigateToDashboard,
      });
      if (finalizeError) {
        applyClerkError(finalizeError);
      }
      return;
    }

    if (signUp.unverifiedFields.includes("email_address")) {
      const { error: sendCodeError } =
        await signUp.verifications.sendEmailCode();
      if (sendCodeError) {
        applyClerkError(sendCodeError);
        return;
      }
      setResendCooldown(30);
      setIsVerifyingEmail(true);
    }
  }

  async function handleResendOtp() {
    if (!signUp) return;
    setAuthError(null);
    setResendMessage(null);

    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      applyClerkError(error);
      return;
    }

    setResendCooldown(30);
    setResendMessage("A new verification code has been sent.");
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setAuthError(null);
    setResendMessage(null);

    const { error } = await signUp.verifications.verifyEmailCode({
      code: otpCode,
    });
    if (error) {
      applyClerkError(error);
      return;
    }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize({
        navigate: navigateToDashboard,
      });
      if (finalizeError) {
        applyClerkError(finalizeError);
      }
      return;
    }

    const remaining = [...signUp.missingFields, ...signUp.unverifiedFields];

    setAuthError(
      remaining.length > 0
        ? `Sign-up status is "${signUp.status}". Remaining: ${remaining.join(", ")}.`
        : `Sign-up status is "${signUp.status}" and could not be completed.`,
    );
  }

  async function handleGoogleAuth() {
    setAuthError(null);

    if (type === "signin") {
      if (!signIn) return;
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/dashboard",
      });
      if (error) applyClerkError(error);
    } else {
      if (!signUp) return;
      const { error } = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/dashboard",
      });
      if (error) applyClerkError(error);
    }
  }

  const isFetching =
    type === "signin"
      ? signInFetchStatus === "fetching"
      : signUpFetchStatus === "fetching";
  const isSubmitting =
    type === "signin"
      ? signInForm.formState.isSubmitting
      : signUpForm.formState.isSubmitting;
  const isLoading = isSubmitting || isFetching;

  const clerkErrorMessage =
    type === "signin"
      ? (signInErrors.global?.[0]?.longMessage ??
        signInErrors.global?.[0]?.message)
      : (signUpErrors.global?.[0]?.longMessage ??
        signUpErrors.global?.[0]?.message);

  const activeGlobalError = authError ?? clerkErrorMessage ?? null;
  const formDisabled =
    isLoading || isRateLimited || isRateLimitMessage(clerkErrorMessage);

  const rateLimited = isRateLimited || isRateLimitMessage(clerkErrorMessage);

  const renderGlobalError = (hint: React.ReactNode) =>
    activeGlobalError ? (
      <div
        role="alert"
        className="border-destructive/30 bg-destructive/10 flex flex-col gap-1 border p-3"
      >
        <p className="text-destructive text-[13px] font-medium">
          {activeGlobalError}
        </p>
        {rateLimited && (
          <p className="text-muted-foreground text-xs leading-relaxed">
            {hint}
          </p>
        )}
      </div>
    ) : null;

  const googleHint = (
    <>
      Please use{" "}
      <span className="text-foreground font-semibold">
        Continue with Google
      </span>{" "}
      above instead.
    </>
  );

  /* ───────────── Email verification (OTP) ───────────── */
  if (type === "signup" && isVerifyingEmail) {
    return (
      <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <span className="bg-muted text-primary grid size-12 place-items-center">
            <MailIcon size={22} aria-hidden="true" />
          </span>
          <h2 className="font-serif text-3xl leading-[1.05] font-extrabold tracking-[-0.06em] sm:text-4xl">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-semibold">
              {signUpForm.getValues("email")}
            </span>
            . Enter it below to finish joining.
          </p>
        </div>

        <InputOTP
          maxLength={6}
          value={otpCode}
          onChange={setOtpCode}
          disabled={formDisabled}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        {resendMessage && (
          <p className="text-muted-foreground text-xs">{resendMessage}</p>
        )}

        {renderGlobalError(
          <>
            Email verification is temporarily paused. Go back and continue with
            Google instead.
          </>,
        )}

        <Button
          type="submit"
          size="lg"
          variant="red"
          isLoading={isLoading}
          loadingTxt="Verifying..."
          disabled={formDisabled || otpCode.length < 6}
          className="w-full"
        >
          Verify & Continue
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            disabled={formDisabled || resendCooldown > 0}
            onClick={handleResendOtp}
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend code"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isLoading}
            onClick={() => {
              setIsVerifyingEmail(false);
              setOtpCode("");
              setAuthError(null);
              setResendMessage(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  /* ───────────── Sign in / Sign up ───────────── */
  return (
    <form
      id={`auth-form-${type}`}
      onSubmit={
        type === "signin"
          ? signInForm.handleSubmit(onSignInSubmit)
          : signUpForm.handleSubmit(onSignUpSubmit)
      }
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1.5">
        <Eyebrow lineClass="bg-primary" label={copy.eyebrow} />
        <h2 className="mt-2 font-serif text-2xl leading-[1.05] font-extrabold tracking-[-0.06em] sm:text-3xl">
          {copy.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {copy.description}
        </p>
      </div>

      <Button
        type="button"
        variant="dark"
        size="lg"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="text-[13px]"
      >
        <FcGoogle className="size-4.5" />
        <span>Continue with Google</span>
      </Button>

      <div className="flex items-center gap-4">
        <Separator orientation="horizontal" className="flex-1" />
        <span className="text-muted-foreground text-xs">or use your email</span>
        <Separator orientation="horizontal" className="flex-1" />
      </div>

      {type === "signup" ? (
        <FieldGroup className="gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="firstName"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <HiOutlineUser />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="auth-first-name-signup"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="First Name"
                      autoComplete="given-name"
                      disabled={formDisabled}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <HiOutlineUserGroup />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="auth-last-name-signup"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Last Name"
                      autoComplete="family-name"
                      disabled={formDisabled}
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="email"
            control={signUpForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon>
                    <MdOutlineAlternateEmail />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="auth-email-signup"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={formDisabled}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={signUpForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon>
                    <AiOutlineLock />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="auth-password-signup"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="At least 8 characters"
                    disabled={formDisabled}
                    autoComplete="new-password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      disabled={formDisabled}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <ImEye /> : <ImEyeBlocked />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div id="clerk-captcha" />

          {renderGlobalError(googleHint)}

          <Button
            type="submit"
            size="lg"
            variant="red"
            disabled={formDisabled}
            isLoading={isLoading}
            loadingTxt="Please wait.."
            className="w-full text-[13px]"
          >
            {copy.submitLabel}
          </Button>
        </FieldGroup>
      ) : (
        <FieldGroup className="gap-3">
          <Controller
            name="email"
            control={signInForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon>
                    <MdOutlineAlternateEmail />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="auth-email-signin"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={formDisabled}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={signInForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon>
                    <AiOutlineLock />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="auth-password-signin"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your password"
                    disabled={formDisabled}
                    autoComplete="current-password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      disabled={formDisabled}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <ImEye /> : <ImEyeBlocked />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div id="clerk-captcha" />

          {renderGlobalError(googleHint)}

          <Button
            type="submit"
            size="lg"
            variant="red"
            disabled={formDisabled}
            isLoading={isLoading}
            loadingTxt="Please wait.."
            className="w-full text-[13px]"
          >
            {copy.submitLabel}
          </Button>
        </FieldGroup>
      )}
    </form>
  );
};
