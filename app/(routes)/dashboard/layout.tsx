import React from "react";

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  return <React.Fragment>{props.children}</React.Fragment>;
}
