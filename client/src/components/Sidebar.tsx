import React from "react";
import Link from "next/link";
import Image from "next/image";

const Sidebar = ({ user }: SidebarProps) => {
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer iten-center gap-2">
          <Image
            src={/* TODO: Add logo */}
            alt="Interlock Logo"
            width={32}
            height={32}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sizebar-logo">Interlock</h1>
        </Link>
      </nav>
    </section>
  );
};

export default Sidebar;
