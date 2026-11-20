import React from "react";

export default function AuthLayout(props: Readonly<LayoutProps<"/">>) {
  return <React.Fragment>{props.children}</React.Fragment>;
}
