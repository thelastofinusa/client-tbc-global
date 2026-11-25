import { GlobalProvider } from "~/components/providers/global";

export default function RoutesLayout(props: Readonly<LayoutProps<"/">>) {
  return <GlobalProvider>{props.children}</GlobalProvider>;
}
