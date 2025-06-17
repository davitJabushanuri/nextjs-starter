import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "bg-blue-600",
      "text-white",
      "h-10",
      "px-4",
      "py-2",
    );
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "border-gray-300");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-100");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-gray-900");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "text-blue-600",
      "underline-offset-4",
    );
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9", "px-3");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-11", "px-8");

    rerender(<Button size="icon">I</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10", "w-10");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveClass("opacity-50", "pointer-events-none");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole("button", { name: "Loading" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");

    // Check for loading spinner
    const spinner = button.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
    expect(spinner).toHaveAttribute("aria-hidden", "true");
  });

  it("renders with left icon", () => {
    const leftIcon = <span data-testid="left-icon">Left</span>;
    render(<Button leftIcon={leftIcon}>With Left Icon</Button>);

    const button = screen.getByRole("button", { name: "With Left Icon" });
    const icon = screen.getByTestId("left-icon");

    expect(button).toContainElement(icon);
    expect(icon.parentElement).toHaveClass("mr-2");
    expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("renders with right icon", () => {
    const rightIcon = <span data-testid="right-icon">Right</span>;
    render(<Button rightIcon={rightIcon}>With Right Icon</Button>);

    const button = screen.getByRole("button", { name: "With Right Icon" });
    const icon = screen.getByTestId("right-icon");

    expect(button).toContainElement(icon);
    expect(icon.parentElement).toHaveClass("ml-2");
    expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("hides icons when loading", () => {
    const leftIcon = <span data-testid="left-icon">Left</span>;
    const rightIcon = <span data-testid="right-icon">Right</span>;

    render(
      <Button loading leftIcon={leftIcon} rightIcon={rightIcon}>
        Loading with icons
      </Button>,
    );

    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();

    // But spinner should be present
    const button = screen.getByRole("button");
    const spinner = button.querySelector("svg");
    expect(spinner).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref test</Button>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button", { name: "Custom" });
    expect(button).toHaveClass("custom-class");
    // Should still have default classes
    expect(button).toHaveClass("bg-blue-600");
  });

  it("passes through additional props", () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom label">
        Props test
      </Button>,
    );

    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom label");
  });

  it("has correct accessibility attributes", () => {
    render(<Button>Accessible button</Button>);

    const button = screen.getByRole("button", { name: "Accessible button" });
    expect(button).toHaveClass(
      "focus-visible:outline-none",
      "focus-visible:ring-2",
    );
  });

  it("handles keyboard navigation", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard test</Button>);

    const button = screen.getByRole("button", { name: "Keyboard test" });
    button.focus();

    fireEvent.keyDown(button, { key: "Enter" });
    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
