import Link from "next/link";
import { AuthForm } from "../_components/form";

export default function Page() {
  return (
    <section className="flex flex-col gap-8">
      <AuthForm type="signup" />

      <p className="border-line text-muted-foreground border-t pt-6 text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary font-bold underline underline-offset-2"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
