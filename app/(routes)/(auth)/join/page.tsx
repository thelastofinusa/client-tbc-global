import Link from "next/link";
import { AuthForm } from "../_components/form";

export default function Page() {
  return (
    <section className="flex flex-col items-center gap-6">
      <div className="bg-card w-full rounded-3xl  shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] p-8">
        <AuthForm type="signup" />
      </div>

      <p className="font-serif text-[13px] font-medium tracking-wide">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-bold underline underline-offset-2"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
