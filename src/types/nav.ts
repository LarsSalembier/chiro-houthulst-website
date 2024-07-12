import { type Icons } from "~/components/icons";

export interface MainNavItem {
  title: string;
  href: string;
}

export type SidebarNavGroup = {
  title: string;
  items: {
    title: string;
    href: string;
    icon: keyof typeof Icons;
  }[];
};
