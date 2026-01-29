import { Shield, KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "@/components/forms";
import { AuthHeader } from "@/components/auth";

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Forgot Password"
        subtitle="No worries, we'll help you reset it"
        trustItems={[
          { icon: Shield, label: "Secure reset" },
          { icon: KeyRound, label: "Encrypted link" },
        ]}
      />
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
