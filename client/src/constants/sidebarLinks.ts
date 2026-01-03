import {
  Home,
  Landmark,
  History,
  ArrowRightLeft,
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
    route: "/my-banks",
    name: "My Banks",
  },
  {
    imgURL: History,
    route: "/transactions-history",
    name: "Transactions History",
  },
  {
    imgURL: ArrowRightLeft,
    route: "/payment-transfer",
    name: "Transfer Funds",
  },
];
