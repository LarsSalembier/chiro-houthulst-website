import { type Icons } from "~/components/icons";

export interface MainNavigationItem {
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
