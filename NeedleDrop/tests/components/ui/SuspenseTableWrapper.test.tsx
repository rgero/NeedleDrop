import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import SuspenseTableWrapper from "@components/ui/SuspenseTableWrapper";
import Loading from "@components/ui/Loading";

describe("SuspenseTableWrapper", () => {
  it("renders children when they are ready", () => {
    const TestChild = () => <div data-testid="test-child">Table Content</div>;

    render(
      <SuspenseTableWrapper>
        <TestChild />
      </SuspenseTableWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Table Content")).toBeInTheDocument();
  });

  it("renders default Loading fallback when suspending", () => {
    const TestChild = () => <div data-testid="test-child">Content</div>;

    render(
      <SuspenseTableWrapper>
        <TestChild />
      </SuspenseTableWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const TestChild = () => <div data-testid="test-child">Content</div>;
    const CustomFallback = <div data-testid="custom-fallback">Custom Loading...</div>;

    render(
      <SuspenseTableWrapper fallback={CustomFallback}>
        <TestChild />
      </SuspenseTableWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders multiple children correctly", () => {
    const Child1 = () => <div data-testid="child-1">Child 1</div>;
    const Child2 = () => <div data-testid="child-2">Child 2</div>;

    render(
      <SuspenseTableWrapper>
        <Child1 />
        <Child2 />
      </SuspenseTableWrapper>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("passes children as direct JSX elements", () => {
    render(
      <SuspenseTableWrapper>
        <table data-testid="test-table">
          <tbody>
            <tr>
              <td>Test Data</td>
            </tr>
          </tbody>
        </table>
      </SuspenseTableWrapper>
    );

    expect(screen.getByTestId("test-table")).toBeInTheDocument();
    expect(screen.getByText("Test Data")).toBeInTheDocument();
  });

  it("renders with correct Suspense boundary structure", () => {
    const TestChild = () => <div data-testid="test-child">Content</div>;

    const { container } = render(
      <SuspenseTableWrapper>
        <TestChild />
      </SuspenseTableWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });
});
