import { ReactNode, ElementType } from "react";

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: ElementType;
}

// Component that hides content visually but keeps it accessible to screen readers.
export function VisuallyHidden({
  children,
  as: Component = "span",
}: VisuallyHiddenProps) {
  return <Component className="sr-only">{children}</Component>;
}
