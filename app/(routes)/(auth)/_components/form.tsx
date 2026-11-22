"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
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
  { title: string; description: string; submitLabel: string }
> = {
  signup: {
    title: "Join the Ministry",
    description: "Register to stay connected and check in.",
    submitLabel: "Join the Family",
  },
  signin: {
    title: "Welcome back home",
    description: "Sign in to access your profile and check in.",
    submitLabel: "Continue",
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

  if (type === "signup" && isVerifyingEmail) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="font-serif text-[19px] leading-tight font-semibold sm:text-xl">
            Verify your email
          </h2>
          <p className="text-muted-foreground max-w-sm text-xs leading-relaxed sm:text-sm">
            Enter the 6-digit verification code sent to{" "}
            <span className="text-foreground font-medium">
              {signUpForm.getValues("email")}
            </span>
            .
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

        {activeGlobalError && (
          <div className="space-y-1">
            <p role="alert" className="text-destructive text-[13px]">
              {activeGlobalError}
            </p>
            {formDisabled && (
              <p className="text-muted-foreground text-xs">
                Email verification is temporarily paused. Go back and continue
                with Google instead.
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          variant="dark"
          isLoading={isLoading}
          loadingTxt="Verifying..."
          disabled={formDisabled || otpCode.length < 6}
          className="w-full text-[13px]"
        >
          Verify & Continue
        </Button>

        <div className="flex w-full items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1 text-[13px]"
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
            className="text-[13px]"
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

  return (
    <form
      id={`auth-form-${type}`}
      onSubmit={
        type === "signin"
          ? signInForm.handleSubmit(onSignInSubmit)
          : signUpForm.handleSubmit(onSignUpSubmit)
      }
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col items-center gap-0.5 text-center">
        <h2 className="font-serif text-[19px] leading-tight font-semibold sm:text-xl">
          {copy.title}
        </h2>

        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed sm:text-sm">
          {copy.description}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleAuth}
        disabled={isLoading}
      >
        <FcGoogle className="size-4.5" />
        <span className="text-[13px]">Continue with Google</span>
      </Button>

      <div className="my-1 flex items-center gap-4">
        <Separator orientation="horizontal" className="flex-1" />
        <span className="text-muted-foreground/80 text-xs">OR</span>
        <Separator orientation="horizontal" className="flex-1" />
      </div>

      {type === "signup" ? (
        <FieldGroup className="gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Controller
              name="firstName"
              control={signUpForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <AiOutlineUser />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="auth-first-name-signup"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="First name"
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
                      <AiOutlineUser />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="auth-last-name-signup"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Last name"
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
                    placeholder="Email Address"
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
                    placeholder="Password"
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

          {activeGlobalError && (
            <div className="space-y-1">
              <p role="alert" className="text-destructive text-[13px]">
                {activeGlobalError}
              </p>
              {formDisabled && (
                <p className="text-muted-foreground text-xs">
                  Email sign-up is temporarily rate-limited. Please use{" "}
                  <span className="text-foreground font-medium">
                    Continue with Google
                  </span>{" "}
                  above.
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="dark"
            disabled={formDisabled}
            isLoading={isLoading}
            loadingTxt="Please wait.."
            className="text-[13px]"
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
                    placeholder="Email Address"
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
                    placeholder="Password"
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

          {activeGlobalError && (
            <div className="space-y-1">
              <p role="alert" className="text-destructive text-[13px]">
                {activeGlobalError}
              </p>
              {formDisabled && (
                <p className="text-muted-foreground text-xs">
                  Verification requests are temporarily rate-limited. Please use{" "}
                  <span className="text-foreground font-medium">
                    Continue with Google
                  </span>{" "}
                  above.
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="dark"
            disabled={formDisabled}
            isLoading={isLoading}
            loadingTxt="Please wait.."
            className="text-[13px]"
          >
            {copy.submitLabel}
          </Button>
        </FieldGroup>
      )}
    </form>
  );
};
