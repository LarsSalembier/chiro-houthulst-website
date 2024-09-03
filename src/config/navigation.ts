import { type SidebarNavGroup, type MainNavigationItem } from "~/types/nav";

export interface NavigationConfig {
  mainNav: MainNavigationItem[];
  sidebarNavGroups: SidebarNavGroup[];
}

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: "Kalender",
      href: "/kalender",
    },
    {
      title: "Nieuws",
      href: "/#nieuws-updates",
    },
    {
      title: "Afdelingen",
      href: "/#afdelingen",
    },
    {
      title: "Verzekering",
      href: "/verzekeringen",
    },
    {
      title: "Contact",
      href: "/#contacteer-ons",
    },
  ],
  sidebarNavGroups: [
    {
      title: "Algemeen",
      items: [
        {
          title: "Zondag",
          href: "/#zondag",
          icon: "SquareGanttChart",
        },
        {
          title: "Kamp",
          href: "/#kamp",
          icon: "Tent",
        },
        {
          title: "Inschrijving",
          href: "/#inschrijven",
          icon: "UserPlus",
        },
        {
          title: "Uniform",
          href: "/#uniform",
          icon: "Shirt",
        },
        {
          title: "Verzekering",
          href: "/verzekeringen",
          icon: "ShieldCheck",
        },
      ],
    },
    {
      title: "Activiteiten",
      items: [
        {
          title: "Aankomende activiteiten",
          href: "/#aankomende-activiteiten",
          icon: "CalendarX",
        },
        {
          title: "Kalender",
          href: "/kalender",
          icon: "CalendarDays",
        },
      ],
    },
    {
      title: "Informatie",
      items: [
        {
          title: "Nieuws en updates",
          href: "/#nieuws-updates",
          icon: "Newspaper",
        },
        {
          title: "Afdelingen",
          href: "/#afdelingen",
          icon: "Users",
        },
        {
          title: "Sponsors",
          href: "/#sponsors",
          icon: "HandCoins",
        },
      ],
    },
    {
      title: "Contact",
      items: [
        {
          title: "Contacteer ons",
          href: "/#contacteer-ons",
          icon: "Send",
        },
        {
          title: "Hoofdleiding",
          href: "/#hoofdleiding",
          icon: "User",
        },
      ],
    },
    {
      title: "Juridisch",
      items: [
        {
          title: "Privacyverklaring",
          href: "/privacyverklaring",
          icon: "GlobeLock",
        },
      ],
    },
    {
      title: "Volg ons",
      items: [
        {
          title: "Facebook",
          href: "https://www.facebook.com/chirohouthulst",
          icon: "Facebook",
        },
        {
          title: "Instagram",
          href: "https://www.instagram.com/chirohouthulst",
          icon: "Instagram",
        },
      ],
    },
    {
      title: "Intern",
      items: [
        {
          title: "Leidingsportaal",
          href: "/leiding",
          icon: "FolderLock",
        },
        {
          title: "Adminportaal",
          href: "/admin",
          icon: "Construction",
        },
      ],
    },
  ],
};
