import React from "react";

export default function AuthLayout(props: LayoutProps<"/">) {
  return <React.Fragment>{props.children}</React.Fragment>;
}
