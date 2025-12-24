"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "../constants/sidebarLinks";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

import InterlockLogo from "../assets/logos/Interlock.svg";

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="sidebar-nav">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image
            src={InterlockLogo}
            alt="Interlock Logo"
            width={32}
            height={32}
            className="sidebar-logo-img"
          />
          <h1 className="sidebar-logo">Interlock</h1>
        </Link>

        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route || pathname.startsWith(link.route);

          return (
            <Link
              href={link.route}
              key={link.name}
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
                "text-black-2": !isActive,
              })}
            >
              <div className="relative size-6">
                <link.imgURL
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>

              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {link.name}
              </p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
