"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/reusable/shadcn/breadcrumb";
import { dashboardNav } from "./nav-config";

const labels: Record<string, string> = Object.fromEntries(
  dashboardNav.flatMap((group) =>
    group.items.map((item) => [item.href.split("/").pop() ?? "", item.label]),
  ),
);

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "dashboard"

  const crumbs =
    segments.length === 0
      ? [{ href: "/dashboard", label: "Overview" }]
      : segments.map((segment, index) => ({
          href: `/dashboard/${segments.slice(0, index + 1).join("/")}`,
          label:
            labels[segment] ??
            segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
        }));

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden min-w-0 md:inline-flex">
          <BreadcrumbLink href="/dashboard" className="truncate">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              <BreadcrumbSeparator
                className={index === 0 ? "hidden md:block" : undefined}
              />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
