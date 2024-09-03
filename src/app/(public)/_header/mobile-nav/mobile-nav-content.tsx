import Link from "next/link";
import React from "react";
import { Icons } from "~/components/icons";
import { ScrollArea } from "~/components/ui/scroll-area";
import NavigationItem from "../navigation-item";
import { siteConfig } from "~/config/site";
import { type SidebarNavGroup } from "~/types/nav";

interface MobileNavContentProps {
  sidebarNavGroups: SidebarNavGroup[];
  closeSheet: () => void;
}

export default function MobileNavContent({
  sidebarNavGroups,
  closeSheet,
}: MobileNavContentProps) {
  return (
    <>
      <Link href="/" className="flex items-center" onClick={closeSheet}>
        <Icons.Logo className="mr-2 h-4 w-4" />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
        <div className="flex flex-col space-y-2">
          {sidebarNavGroups.map((item, index) => (
            <div key={index} className="flex flex-col space-y-3 pt-6">
              <h4 className="font-medium">{item.title}</h4>
              {item?.items?.length &&
                item.items.map((menuItem) => (
                  <NavigationItem
                    key={menuItem.title}
                    navItem={menuItem}
                    onClick={closeSheet}
                  />
                ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
