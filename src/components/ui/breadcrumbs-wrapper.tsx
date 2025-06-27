"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbsWrapperProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbsWrapper({ items }: BreadcrumbsWrapperProps) {
  return (
    <Breadcrumbs className="mb-6">
      {items.map((item, index) => (
        <BreadcrumbItem key={index} href={item.href}>
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
