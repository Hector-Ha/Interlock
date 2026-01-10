import {
  Home,
  Landmark,
  History,
  ArrowRightLeft,
  Send,
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
    imgURL: Send,
    route: "/transfers/new?type=p2p",
    name: "Send Money",
  },
  {
    imgURL: Settings,
    route: "/settings",
    name: "Settings",
  },
];
