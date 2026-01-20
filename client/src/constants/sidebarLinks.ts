import {
  Home,
  Landmark,
  History,
  ArrowRightLeft,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface SidebarLink {
  imgURL: LucideIcon;
  route: string;
  name: string;
}

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: Home,
    route: "/",
    name: "Dashboard",
  },
  {
    imgURL: Landmark,
    route: "/banks",
    name: "My Banks",
  },
  {
    imgURL: History,
    route: "/transactions",
    name: "Transaction History",
  },
  {
    imgURL: ArrowRightLeft,
    route: "/transfers",
    name: "Transfer Funds",
  },
  {
    imgURL: Settings,
    route: "/settings",
    name: "Settings",
  },
];
