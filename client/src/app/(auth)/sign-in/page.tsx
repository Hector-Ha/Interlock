import { Shield, Lock } from "lucide-react";
import { SignInForm } from "@/components/forms";
import { AuthHeader, DemoCredentialsHint } from "@/components/auth";

export default function SignInPage() {
  return (
    <>
      <AuthHeader
        title="Welcome To Interlock"
        subtitle="Sign in to access your accounts"
        trustItems={[
          { icon: Shield, label: "Secure login" },
          { icon: Lock, label: "256-bit encryption" },
        ]}
      />
      <div className="mt-6">
        <SignInForm />
      </div>
    </>
  );
}
