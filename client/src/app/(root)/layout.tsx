import Sidebar from "@/src/components/layout/Sidebar";
import Image from "next/image";
import InterlockLogo from "@/src/assets/logos/Interlock.svg";
import MobileNav from "@/src/components/layout/MobileNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = {
    firstName: "Hector",
    lastName: "Ha",
    email: "hector@interlock.com",
  };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedInUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src={InterlockLogo}
            alt="Interlock Logo"
            width={32}
            height={32}
          />
          <div>
            <MobileNav user={loggedInUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
