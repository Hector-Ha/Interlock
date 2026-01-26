import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

function SettingsNavSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-gray-soft)] p-2 space-y-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
        >
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-28 hidden lg:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <Card
      padding="none"
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-gray-hover)] via-[#2d2d3a] to-[var(--color-gray-text)]"
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="settings-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 16h32M16 0v32"
                stroke="white"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#settings-grid)" />
        </svg>
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-7 w-40 mb-2 bg-white/10" />
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-4 rounded bg-white/10" />
              <Skeleton className="h-4 w-48 bg-white/10" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FormCardSkeleton() {
  return (
    <Card padding="none" className="border-[var(--color-gray-soft)]">
      <div className="p-5 border-b border-[var(--color-gray-soft)]">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-3 w-64 mt-1.5" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-gray-soft)]">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

function SecurityCardSkeleton() {
  return (
    <Card padding="none" className="border-[var(--color-gray-soft)]">
      <div className="p-5 border-b border-[var(--color-gray-soft)]">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-[var(--color-gray-soft)] last:border-0"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function NotificationCardSkeleton() {
  return (
    <Card padding="none" className="border-[var(--color-gray-soft)]">
      <div className="p-5 border-b border-[var(--color-gray-soft)]">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-36 mb-1" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-[var(--color-gray-soft)] last:border-0"
          >
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function BankSettingsCardSkeleton() {
  return (
    <Card padding="none" className="border-[var(--color-gray-soft)]">
      <div className="p-5 border-b border-[var(--color-gray-soft)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div>
              <Skeleton className="h-5 w-36 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-gray-soft)]"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SettingsContentSkeleton() {
  return (
    <div className="space-y-6">
      <ProfileCardSkeleton />
      <FormCardSkeleton />
    </div>
  );
}

function SettingsPageSkeleton() {
  return (
    <section className="min-h-screen bg-[var(--color-gray-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-28 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8">
              <SettingsNavSkeleton />
            </div>
          </nav>

          <main className="flex-1 min-w-0">
            <SettingsContentSkeleton />
          </main>
        </div>
      </div>
    </section>
  );
}

export {
  SettingsNavSkeleton,
  ProfileCardSkeleton,
  FormCardSkeleton,
  SecurityCardSkeleton,
  NotificationCardSkeleton,
  BankSettingsCardSkeleton,
  SettingsContentSkeleton,
  SettingsPageSkeleton,
};
