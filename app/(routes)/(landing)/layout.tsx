import React from "react";
import { Footer } from "~/components/shared/footer";
import { Header } from "~/components/shared/header";

export default function LandingLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <React.Fragment>
      <Header />
      <main className="flex-1">{props.children}</main>
      <Footer />
    </React.Fragment>
  );
}
