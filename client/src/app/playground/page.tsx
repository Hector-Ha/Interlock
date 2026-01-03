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
  Phone,
  CreditCard,
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
              New Reduced Palette: Surface, Soft (Selected), Disabled
              (Unselectable), Main, Hover, Text.
            </p>
          </div>

          <div className="space-y-8">
            {/* Base Colors */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Base
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <ColorSwatch
                  name="White"
                  variable="var(--color-white)"
                  hex="#FFFFFF"
                  className="border"
                />
                <ColorSwatch
                  name="Black"
                  variable="var(--color-black)"
                  hex="#000000"
                />
              </div>
            </div>

            {/* Palette Groups */}
            {[
              {
                label: "Grayscale (Slate)",
                prefix: "gray",
                colors: [
                  {
                    name: "Surface",
                    var: "--color-gray-surface",
                    hex: "#F8F9FA",
                  },
                  {
                    name: "Soft (Selected)",
                    var: "--color-gray-soft",
                    hex: "#E9ECEF",
                  },
                  {
                    name: "Disabled",
                    var: "--color-gray-disabled",
                    hex: "#DEE2E6",
                  },
                  { name: "Main", var: "--color-gray-main", hex: "#70707B" },
                  { name: "Hover", var: "--color-gray-hover", hex: "#495057" },
                  { name: "Text", var: "--color-gray-text", hex: "#212529" },
                ],
              },
              {
                label: "Brand (Violet)",
                prefix: "brand",
                colors: [
                  {
                    name: "Surface",
                    var: "--color-brand-surface",
                    hex: "#F5F3FF",
                  },
                  {
                    name: "Soft (Selected)",
                    var: "--color-brand-soft",
                    hex: "#EDE9FE",
                  },
                  {
                    name: "Disabled",
                    var: "--color-brand-disabled",
                    hex: "#C4B5FD",
                  },
                  {
                    name: "Brand Main",
                    var: "--color-brand-main",
                    hex: "#7839EE",
                  },
                  { name: "Hover", var: "--color-brand-hover", hex: "#6D28D9" },
                  { name: "Text", var: "--color-brand-text", hex: "#4C1D95" },
                ],
              },
              {
                label: "Error (Red)",
                prefix: "error",
                colors: [
                  {
                    name: "Surface",
                    var: "--color-error-surface",
                    hex: "#FEF2F2",
                  },
                  {
                    name: "Soft (Selected)",
                    var: "--color-error-soft",
                    hex: "#FEE2E2",
                  },
                  {
                    name: "Disabled",
                    var: "--color-error-disabled",
                    hex: "#FECACA",
                  },
                  { name: "Main", var: "--color-error-main", hex: "#EF4444" },
                  { name: "Hover", var: "--color-error-hover", hex: "#DC2626" },
                  { name: "Text", var: "--color-error-text", hex: "#7F1D1D" },
                ],
              },
              {
                label: "Warning (Amber)",
                prefix: "warning",
                colors: [
                  {
                    name: "Surface",
                    var: "--color-warning-surface",
                    hex: "#FFFBEB",
                  },
                  {
                    name: "Soft (Selected)",
                    var: "--color-warning-soft",
                    hex: "#FEF3C7",
                  },
                  {
                    name: "Disabled",
                    var: "--color-warning-disabled",
                    hex: "#FDE68A",
                  },
                  { name: "Main", var: "--color-warning-main", hex: "#F59E0B" },
                  {
                    name: "Hover",
                    var: "--color-warning-hover",
                    hex: "#D97706",
                  },
                  { name: "Text", var: "--color-warning-text", hex: "#78350F" },
                ],
              },
              {
                label: "Success (Emerald)",
                prefix: "success",
                colors: [
                  {
                    name: "Surface",
                    var: "--color-success-surface",
                    hex: "#ECFDF5",
                  },
                  {
                    name: "Soft (Selected)",
                    var: "--color-success-soft",
                    hex: "#D1FAE5",
                  },
                  {
                    name: "Disabled",
                    var: "--color-success-disabled",
                    hex: "#A7F3D0",
                  },
                  { name: "Main", var: "--color-success-main", hex: "#10B981" },
                  {
                    name: "Hover",
                    var: "--color-success-hover",
                    hex: "#059669",
                  },
                  { name: "Text", var: "--color-success-text", hex: "#064E3B" },
                ],
              },
            ].map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {group.colors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      name={color.name}
                      variable={`var(${color.var})`}
                      hex={color.hex}
                      className={
                        color.name === "Surface" || color.name === "Soft"
                          ? "border"
                          : ""
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
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
                  <label className="text-sm font-medium leading-none">
                    Password (with Toggle)
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    showPasswordToggle
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Phone Number (Start Icon)
                  </label>
                  <Input
                    type="tel"
                    placeholder="555-0123"
                    startIcon={<Phone className="h-4 w-4" />}
                    numericOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    CVV (End Icon)
                  </label>
                  <Input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    endIcon={<CreditCard className="h-4 w-4" />}
                    numericOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Success State
                  </label>
                  <Input type="text" defaultValue="Valid Input" success />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Read Only
                  </label>
                  <Input type="text" defaultValue="Read Only Value" readOnly />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-red-500">
                    Error State
                  </label>
                  <Input type="text" placeholder="Error input" error />
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
          "h-20 w-full rounded-lg shadow-sm border border-border",
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
