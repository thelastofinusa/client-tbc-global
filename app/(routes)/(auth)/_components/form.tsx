"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Separator } from "~/components/reusable/shadcn/separator";
import { Eyebrow } from "~/components/shared/eyebrow";
import { authClient } from "~/lib/auth/auth-client";

const signUpSchema = z.object({
  firstName: z
    .string()
    .max(50, "First name must be at most 50 characters.")
    .or(z.literal("")),
  lastName: z
    .string()
    .max(50, "Last name must be at most 50 characters.")
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

export const AuthForm: React.FC<{ type: "signin" | "signup" }> = ({ type }) => {
  const router = useRouter();
  const copy = copyByType[type];

  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Better Auth sends people back here with ?error=... when Google sign-in fails.
  React.useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (!code) return;
    setAuthError(
      code === "account_not_linked"
        ? "This email already has an account. Sign in with your password once, then try Google again."
        : "Google sign-in didn’t complete. Please try again.",
    );
  }, []);

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

  async function onSignInSubmit(data: SignInFormValues) {
    setAuthError(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: data.email.trim(),
        password: data.password,
      });

      if (error) {
        setAuthError(
          error.message ?? "Invalid email or password. Please try again.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignUpSubmit(data: SignUpFormValues) {
    setAuthError(null);
    setIsLoading(true);

    try {
      const fullName =
        [data.firstName?.trim(), data.lastName?.trim()]
          .filter(Boolean)
          .join(" ") || "Member";

      const { error } = await authClient.signUp.email({
        email: data.email.trim(),
        password: data.password,
        name: fullName,
        firstName: data.firstName?.trim() || "",
        lastName: data.lastName?.trim() || "",
      });

      if (error) {
        setAuthError(
          error.message ?? "Could not create account. Please try again.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setAuthError(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/dashboard",
        errorCallbackURL: type === "signin" ? "/sign-in" : "/sign-up",
      });

      if (error) {
        setAuthError(
          error.message ??
            "Failed to authenticate with Google. Please try again.",
        );
        setIsLoading(false);
      }
    } catch {
      setAuthError("Failed to authenticate with Google. Please try again.");
      setIsLoading(false);
    }
  }

  const isSubmitting =
    type === "signin"
      ? signInForm.formState.isSubmitting
      : signUpForm.formState.isSubmitting;
  const formLoading = isLoading || isSubmitting;

  const renderGlobalError = () =>
    authError ? (
      <div
        role="alert"
        className="border-destructive/30 bg-destructive/10 flex flex-col gap-1 border p-3"
      >
        <p className="text-destructive text-[13px] font-medium">{authError}</p>
      </div>
    ) : null;

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
        disabled={formLoading}
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
                      disabled={formLoading}
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
                      disabled={formLoading}
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
                    disabled={formLoading}
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
                    disabled={formLoading}
                    autoComplete="new-password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      disabled={formLoading}
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

          {renderGlobalError()}

          <Button
            type="submit"
            size="lg"
            variant="red"
            disabled={formLoading}
            isLoading={formLoading}
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
                    disabled={formLoading}
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
                    disabled={formLoading}
                    autoComplete="current-password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      disabled={formLoading}
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

          {renderGlobalError()}

          <Button
            type="submit"
            size="lg"
            variant="red"
            disabled={formLoading}
            isLoading={formLoading}
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
