import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea } from "@/components/ui/ScrollArea";

describe("ScrollArea", () => {
  it("should render children correctly", () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>,
    );

    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("should apply custom className to root", () => {
    const { container } = render(
      <ScrollArea className="custom-scroll-class">
        <p>Content</p>
      </ScrollArea>,
    );

    const root = container.firstChild;
    expect(root).toHaveClass("custom-scroll-class");
    expect(root).toHaveClass("relative");
    expect(root).toHaveClass("overflow-hidden");
  });

  it("should render viewport with correct classes", () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>,
    );

    // Find the viewport element
    const viewport = container.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveClass("h-full");
    expect(viewport).toHaveClass("w-full");
  });
});
