"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlaygroundPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <AppShell>
      <div className="space-y-16 pb-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-google-sans">
            Design System
          </h1>
          <p className="text-xl text-muted-foreground">
            Core styles and components for the Interlock application.
          </p>
        </div>

        {/* 1. TYPOGRAPHY */}
        <section className="space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-foreground">Typography</h2>
            <p className="text-muted-foreground">
              Font families: Google Sans (Headings) & Inter (Body)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Headings */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Headings
              </h3>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold font-google-sans">
                    Display Heading 1
                  </h1>
                  <span className="text-xs text-muted-foreground">
                    font-google-sans / text-4xl / bold
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-google-sans">
                    Display Heading 2
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    font-google-sans / text-3xl / bold
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-google-sans">
                    Display Heading 3
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    font-google-sans / text-2xl / bold
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-google-sans">
                    Display Heading 4
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    font-google-sans / text-xl / semibold
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Body Text
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg">
                    Large leading paragraph text for introductions. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <span className="text-xs text-muted-foreground">text-lg</span>
                </div>
                <div>
                  <p className="text-base">
                    Base body text. The quick brown fox jumps over the lazy dog.
                    Used for most content blocks.
                  </p>
                  <span className="text-xs text-muted-foreground">
                    text-base
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Small text for captions, helper text, and secondary
                    information.
                  </p>
                  <span className="text-xs text-muted-foreground">
                    text-sm / text-muted-foreground
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Overline Text
                  </p>
                  <span className="text-xs text-muted-foreground">
                    text-xs / uppercase
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COLORS */}
        <section className="space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-foreground">Colors</h2>
            <p className="text-muted-foreground">
              Core brand and functional color palette.
            </p>
          </div>

          <div className="space-y-8">
            {/* Brand Colors */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Brand
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch
                  name="Primary"
                  variable="var(--primary)"
                  hex="#7839EE"
                />
                <ColorSwatch
                  name="Secondary"
                  variable="var(--secondary)"
                  hex="#FF6384"
                />
                <ColorSwatch name="Accent" variable="var(--accent)" />
              </div>
            </div>

            {/* UI Colors */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                UI Elements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch
                  name="Background"
                  variable="var(--background)"
                  className="border"
                />
                <ColorSwatch name="Foreground" variable="var(--foreground)" />
                <ColorSwatch
                  name="Card"
                  variable="var(--card)"
                  className="border"
                />
                <ColorSwatch name="Border" variable="var(--border)" />
                <ColorSwatch name="Input" variable="var(--input)" />
                <ColorSwatch name="Muted" variable="var(--muted)" />
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Functional & Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch name="Destructive" variable="var(--destructive)" />
                <ColorSwatch name="Chart 1" variable="var(--chart-1)" />
                <ColorSwatch name="Chart 2" variable="var(--chart-2)" />
                <ColorSwatch name="Chart 3" variable="var(--chart-3)" />
                <ColorSwatch name="Chart 4" variable="var(--chart-4)" />
                <ColorSwatch name="Chart 5" variable="var(--chart-5)" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. SPACING & RADIUS */}
        <section className="space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Shape & Spacing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Border Radius
              </h3>
              <div className="flex gap-4 items-end">
                <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-sm flex items-center justify-center text-xs">
                  sm
                </div>
                <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-md flex items-center justify-center text-xs">
                  md
                </div>
                <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-lg flex items-center justify-center text-xs">
                  lg
                </div>
                <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-xl flex items-center justify-center text-xs">
                  xl
                </div>
                <div className="w-16 h-16 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center text-xs">
                  full
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Shadows
              </h3>
              <div className="flex flex-wrap gap-6">
                <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center text-xs text-gray-500">
                  sm
                </div>
                <div className="w-24 h-24 bg-white rounded-lg shadow flex items-center justify-center text-xs text-gray-500">
                  default
                </div>
                <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center text-xs text-gray-500">
                  md
                </div>
                <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-xs text-gray-500">
                  lg
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPONENTS */}
        <section className="space-y-8">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-foreground">Components</h2>
          </div>

          <div className="grid gap-12">
            {/* Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
                <Button className="rounded-full">Rounded Full</Button>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Badges</h3>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            {/* Inputs & Forms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inputs</h3>
              <div className="grid max-w-sm gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Email
                  </label>
                  <Input type="email" placeholder="Email address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-red-500">
                    Error State
                  </label>
                  <Input
                    type="text"
                    placeholder="Error input"
                    className="border-red-500 focus-visible:ring-red-500"
                  />
                  <p className="text-[0.8rem] text-red-500">
                    Invalid email address
                  </p>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cards</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Simple Card</CardTitle>
                    <CardDescription>
                      A basic card with header and content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content goes here. Cards are used to group related
                      information together.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Card</CardTitle>
                    <CardDescription>Card with footer actions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Click the button below to take action.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Take Action</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alerts</h3>
              <div className="grid gap-4 max-w-2xl">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Critical Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again later.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ColorSwatch({
  name,
  variable,
  hex,
  className,
}: {
  name: string;
  variable: string;
  hex?: string;
  className?: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "h-20 w-full rounded-lg shadow-sm border border-slate-100",
          className
        )}
        style={{ backgroundColor: variable }}
      />
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground font-mono">
          {hex || variable}
        </div>
      </div>
    </div>
  );
}
