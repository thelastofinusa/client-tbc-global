"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLock } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import { MdOutlineAlternateEmail } from "react-icons/md";
import * as z from "zod";
import { Button } from "~/components/reusable/shadcn/button";
import { Field, FieldError, FieldGroup } from "~/components/reusable/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/reusable/shadcn/input-group";
import { Separator } from "~/components/reusable/shadcn/separator";
import { sleep } from "~/lib/utils";

const formSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .min(1, "Email address is required.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

type AuthFormValues = z.infer<typeof formSchema>;

const copyByType: Record<
  "signin" | "signup",
  { title: string; description: string; submitLabel: string }
> = {
  signup: {
    title: "Join the Ministry",
    description: "Register to stay connected and check in.",
    submitLabel: "Create Account",
  },
  signin: {
    title: "Welcome back home",
    description: "Sign in to access your profile and check in.",
    submitLabel: "Sign In",
  },
};


export const AuthForm: React.FC<{ type: "signin" | "signup" }> = ({ type }) => {
  const copy = copyByType[type];

  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    setIsSubmitting(true)
    await sleep()
    console.log(data);
    setIsSubmitting(false)
  }

  function handleGoogleAuth() {
    // Wire up Google OAuth sign-in / sign-up here
  }

  const isLoading = form.formState.isSubmitting || isSubmitting

  return (
    <form
      id={`auth-form-${type}`}
      onSubmit={form.handleSubmit(onSubmit)}
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

      <FieldGroup className="gap-3">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup>
                <InputGroupAddon>
                  <MdOutlineAlternateEmail />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id={`auth-email-${type}`}
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Email Address"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup>
                <InputGroupAddon>
                  <AiOutlineLock />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id={`auth-password-${type}`}
                  type={showPassword ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                  disabled={isLoading}
                  autoComplete={type === "signup" ? "new-password" : "current-password"}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <ImEye /> : <ImEyeBlocked />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          variant="dark"
          isLoading={isLoading}
          loadingTxt="Please wait.."
          className="text-[13px]"
        >
            {copy.submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
};
