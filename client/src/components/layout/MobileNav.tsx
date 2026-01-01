"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import InterlockLogo from "../../assets/logos/Interlock.svg";
import { sidebarLinks } from "../../constants/sidebarLinks";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Menu className="cursor-pointer" width={30} height={30} />
        </SheetTrigger>
        <SheetContent side="right" className="border-none bg-white">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-1 px-4"
          >
            <Image
              src={InterlockLogo}
              alt="Interlock Logo"
              width={34}
              height={34}
            />
            <h1 className="text-26 font-bold font-google-sans text-[#7839EE]">
              Interlock
            </h1>
          </Link>
          <div className="mobile-nav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-black-2">
                {sidebarLinks.map((link) => {
                  const isActive =
                    pathname === link.route || pathname.startsWith(link.route);

                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        href={link.route}
                        key={link.name}
                        className={cn(
                          "mobilenav-sheet_close w-full flex items-center gap-4 p-4 rounded-lg",
                          {
                            "bg-bank-gradient": isActive,
                          }
                        )}
                      >
                        <link.imgURL
                          className={cn("w-6 h-6", {
                            "brightness-[3] invert-0": isActive,
                          })}
                        />

                        <p
                          className={cn("text-16 font-semibold text-black-2", {
                            "text-white": isActive,
                          })}
                        >
                          {link.name}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
