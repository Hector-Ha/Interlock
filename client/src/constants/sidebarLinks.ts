import {
  LucideArrowRightLeft,
  LucideCardSim,
  LucideHistory,
  LucideHome,
  LucideIcon,
  LucideLandmark,
} from "lucide-react";

export const sidebarLinks = [
  {
    imgURL: LucideHome,
    route: "/",
    name: "Dashboard",
  },
  {
    imgURL: LucideLandmark,
    route: "/my-banks",
    name: "My Banks",
  },
  {
    imgURL: LucideHistory,
    route: "/transactions-history",
    name: "Transactions History",
  },
  {
    imgURL: LucideArrowRightLeft,
    route: "/payment-transfer",
    name: "Payment & Transfer",
  },
];
