"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signUpSchema, type SignUpSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await authService.signUp({
        ...data,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Automatically sign in the user or set user and redirect
      setUser(user);
      router.push("/");
    } catch (err) {
      console.error("Sign up failed", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              placeholder="John"
              label="First Name"
              disabled={isLoading}
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              id="lastName"
              placeholder="Doe"
              label="Last Name"
              disabled={isLoading}
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <Input
            id="address"
            placeholder="123 Main St"
            label="Address"
            disabled={isLoading}
            error={errors.address?.message}
            {...register("address")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="city"
              placeholder="New York"
              label="City"
              disabled={isLoading}
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              id="state"
              placeholder="NY"
              label="State (2 letter code)"
              maxLength={2}
              disabled={isLoading}
              error={errors.state?.message}
              {...register("state")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="postalCode"
              placeholder="10001"
              label="Postal Code"
              disabled={isLoading}
              error={errors.postalCode?.message}
              {...register("postalCode")}
            />
            <Input
              id="dateOfBirth"
              type="date"
              label="Date of Birth"
              disabled={isLoading}
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />
          </div>

          <Input
            id="ssn"
            placeholder="Last 4 digits"
            label="SSN (Last 4 digits)"
            maxLength={4}
            numericOnly
            disabled={isLoading}
            error={errors.ssn?.message}
            {...register("ssn")}
          />

          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            label="Email"
            disabled={isLoading}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            placeholder="Create a password"
            type="password"
            autoComplete="new-password"
            label="Password"
            showPasswordToggle
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
