import React from "react";

export default function DashboardLayout(props: Readonly<LayoutProps<"/">>) {
  return <React.Fragment>{props.children}</React.Fragment>;
}
