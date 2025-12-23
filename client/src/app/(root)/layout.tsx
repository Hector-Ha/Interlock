import Sidebar from "@/src/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = { firstName: "Hector", lastName: "Ha" };

  return (
    <main className="flex h-screen w-full font-sauce-sans">
      <Sidebar user={loggedInUser} />
      {children}
    </main>
  );
}
