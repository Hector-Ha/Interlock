import Link from "next/link";
import Image from "next/image";
import { GuestGuard } from "@/components/auth";
import InterlockLogo from "@/assets/logos/Interlock.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#7839EE] to-[#5B21B6] p-12 flex-col justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={InterlockLogo}
              alt="Interlock"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
            <span className="text-2xl font-bold text-white font-google-sans">
              Interlock
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white font-google-sans leading-tight">
              The Future of
              <br />
              Secure Open Banking
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Connect your accounts, transfer money seamlessly, and take control
              of your finances with enterprise-grade security.
            </p>
          </div>

          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Interlock. All rights reserved.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-muted">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={InterlockLogo}
                  alt="Interlock"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold text-[#7839EE] font-google-sans">
                  Interlock
                </span>
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}
