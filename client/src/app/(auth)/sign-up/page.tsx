import { Shield, UserPlus } from "lucide-react";
import { SignUpForm } from "@/components/forms";
import { AuthHeader } from "@/components/auth";

export default function SignUpPage() {
  return (
    <>
      <AuthHeader
        title="Create Account"
        subtitle="Start managing your finances securely"
        trustItems={[
          { icon: Shield, label: "Bank-level security" },
          { icon: UserPlus, label: "Free to join" },
        ]}
      />
      <div className="mt-4">
        <SignUpForm />
      </div>
    </>
  );
}
