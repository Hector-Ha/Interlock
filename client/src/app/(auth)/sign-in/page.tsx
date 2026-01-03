import { SignInForm } from "@/components/forms";

const SignIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <div className="auth-form w-full max-w-[420px]">
        <header className="flex flex-col gap-5 md:gap-8">
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
              Sign In
              <p className="text-16 font-normal text-gray-600">
                Please enter your details
              </p>
            </h1>
          </div>
        </header>
        <div className="mt-10">
          <SignInForm />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
