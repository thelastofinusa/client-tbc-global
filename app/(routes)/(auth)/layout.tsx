export default function AuthLayout(props: Readonly<LayoutProps<"/">>) {
  return (
    <div className="grid lg:h-dvh lg:grid-cols-3">
      <div className="bg-muted hidden flex-1 lg:block" />
      <main className="lg:col-span-2">{props.children}</main>
    </div>
  );
}
