import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onLoad,
    onError,
    ...props
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
    onError?: () => void;
    [key: string]: unknown;
  }) => (
    <img
      src={src}
      alt={alt}
      data-testid="next-image"
      {...props}
      onLoad={onLoad}
      onError={onError}
    />
  ),
}));

describe("Phase 5 Components - Unit Tests", () => {
  // ResponsiveTable
  describe("ResponsiveTable", () => {
    interface TestData {
      [key: string]: unknown;
      id: string;
      name: string;
      email: string;
      amount: number;
    }

    const testData: TestData[] = [
      { id: "1", name: "John Doe", email: "john@example.com", amount: 100 },
      { id: "2", name: "Jane Smith", email: "jane@example.com", amount: 200 },
    ];

    const columns = [
      { key: "name" as const, header: "Name" },
      { key: "email" as const, header: "Email" },
      { key: "amount" as const, header: "Amount" },
    ];

    it("should render empty state when no data", () => {
      render(
        <ResponsiveTable
          data={[]}
          columns={columns}
          keyExtractor={(item) => (item as TestData).id}
          emptyMessage="No users found"
        />,
      );

      expect(screen.getByText("No users found")).toBeInTheDocument();
    });

    it("should render default empty message when not provided", () => {
      render(
        <ResponsiveTable
          data={[]}
          columns={columns}
          keyExtractor={(item) => (item as TestData).id}
        />,
      );

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("should render table with data", () => {
      render(
        <ResponsiveTable
          data={testData}
          columns={columns}
          keyExtractor={(item) => item.id}
        />,
      );

      // Check headers
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Amount")).toBeInTheDocument();

      // Check data
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("should hide columns marked with hideOnMobile", () => {
      const columnsWithHidden = [
        { key: "name" as const, header: "Name" },
        { key: "email" as const, header: "Email", hideOnMobile: true },
        { key: "amount" as const, header: "Amount" },
      ];

      const { container } = render(
        <ResponsiveTable
          data={testData}
          columns={columnsWithHidden}
          keyExtractor={(item) => item.id}
        />,
      );

      // When hideOnMobile columns are filtered, Email should not appear
      const headers = container.querySelectorAll("th");
      const headerTexts = Array.from(headers).map((h) => h.textContent);

      expect(headerTexts).toContain("Name");
      expect(headerTexts).toContain("Amount");
      expect(headerTexts).not.toContain("Email");
    });

    it("should render mobile card view with mobileCardRender", () => {
      const mobileCardRender = (item: TestData) => (
        <div data-testid={`mobile-card-${item.id}`}>
          <span>{item.name}</span>
          <span>{item.amount}</span>
        </div>
      );

      render(
        <ResponsiveTable
          data={testData}
          columns={columns}
          keyExtractor={(item) => item.id}
          mobileCardRender={mobileCardRender}
        />,
      );

      // Should render mobile cards
      expect(screen.getByTestId("mobile-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("mobile-card-2")).toBeInTheDocument();
    });

    it("should use custom render function for columns", () => {
      const columnsWithRender = [
        { key: "name" as const, header: "Name" },
        {
          key: "amount" as const,
          header: "Amount",
          render: (item: TestData) => <strong>${item.amount}.00</strong>,
        },
      ];

      render(
        <ResponsiveTable
          data={testData}
          columns={columnsWithRender}
          keyExtractor={(item) => item.id}
        />,
      );

      expect(screen.getByText("$100.00")).toBeInTheDocument();
      expect(screen.getByText("$200.00")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ResponsiveTable
          data={testData}
          columns={columns}
          keyExtractor={(item) => item.id}
          className="custom-table-class"
        />,
      );

      const table = container.querySelector("table");
      expect(table).toHaveClass("custom-table-class");
    });
  });

  // OptimizedImage
  describe("OptimizedImage", () => {
    it("should show skeleton while loading", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={200}
          showSkeleton={true}
        />,
      );

      // Skeleton should be present initially
      const skeleton = container.querySelector('[aria-hidden="true"]');
      expect(skeleton).toBeInTheDocument();
    });

    it("should hide skeleton after image loads", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={200}
          showSkeleton={true}
        />,
      );

      // Find the image and trigger load
      const img = screen.getByTestId("next-image");
      fireEvent.load(img);

      // Skeleton should be removed after load
      const skeleton = container.querySelector('[aria-hidden="true"]');
      expect(skeleton).not.toBeInTheDocument();
    });

    it("should not show skeleton when showSkeleton is false", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={200}
          showSkeleton={false}
        />,
      );

      const skeleton = container.querySelector('[aria-hidden="true"]');
      expect(skeleton).not.toBeInTheDocument();
    });

    it("should use fallback image on error", () => {
      render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Test image"
          width={200}
          height={200}
          fallback="/fallback.png"
        />,
      );

      const img = screen.getByTestId("next-image");

      // Initially shows original src
      expect(img).toHaveAttribute("src", "/broken-image.jpg");

      // Trigger error
      fireEvent.error(img);

      // Should switch to fallback
      expect(img).toHaveAttribute("src", "/fallback.png");
    });

    it("should use default fallback when not provided", () => {
      render(
        <OptimizedImage
          src="/broken-image.jpg"
          alt="Test image"
          width={200}
          height={200}
        />,
      );

      const img = screen.getByTestId("next-image");
      fireEvent.error(img);

      // Should use default fallback
      expect(img).toHaveAttribute("src", "/images/placeholder.png");
    });

    it("should apply className to container", () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={200}
          className="custom-image-class"
        />,
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-image-class");
    });

    it("should transition opacity on load", () => {
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={200}
          height={200}
        />,
      );

      const img = screen.getByTestId("next-image");

      expect(img).toHaveClass("opacity-0");

      fireEvent.load(img);
      expect(img).toHaveClass("opacity-100");
    });
  });
});
