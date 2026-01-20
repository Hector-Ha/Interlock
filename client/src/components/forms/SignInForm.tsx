"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signInSchema, type SignInSchema } from "@/lib/validations/auth";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AuthFooterLinks } from "@/components/auth";

export function SignInForm() {
  const router = useRouter();
  const { signIn, isLoading, error: authError, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    clearError();
    try {
      await signIn(data.email, data.password);
      router.push("/");
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="border-t border-border/40" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            label="Email"
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="grid gap-1.5">
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              label="Password"
              showPasswordToggle
              error={errors.password?.message}
              {...register("password")}
            />
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-brand-main hover:text-brand-hover hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {authError && (
            <Alert variant="destructive" className="py-2.5">
              <AlertDescription className="text-sm font-medium">
                {authError}
              </AlertDescription>
            </Alert>
          )}

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full mt-2 font-medium bg-brand-main hover:bg-brand-hover text-white shadow-brand-main/20 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </div>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
      </div>

      <div className="grid gap-2 text-center">
        <AuthFooterLinks mode="sign-in" />

        <p className="hidden sm:block text-xs text-muted-foreground/80 leading-relaxed px-4">
          By signing in, you agree to our <br />
          <Link
            href="/terms"
            className="text-foreground hover:text-brand-main underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground hover:text-brand-main underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
