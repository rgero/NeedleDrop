import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import SuspenseFormWrapper from "@components/ui/SuspenseFormWrapper";

describe("SuspenseFormWrapper", () => {
  it("renders children when they are ready", () => {
    const TestFormChild = () => (
      <form data-testid="test-form">
        <input type="text" placeholder="Name" />
      </form>
    );

    render(
      <SuspenseFormWrapper>
        <TestFormChild />
      </SuspenseFormWrapper>
    );

    expect(screen.getByTestId("test-form")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  });

  it("renders with Typography wrapper by default", () => {
    const TestChild = () => <div data-testid="test-child">Form Content</div>;

    render(
      <SuspenseFormWrapper>
        <TestChild />
      </SuspenseFormWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const TestChild = () => <div data-testid="test-child">Form Content</div>;
    const CustomFallback = <div data-testid="custom-loading">Custom Loading Message</div>;

    render(
      <SuspenseFormWrapper fallback={CustomFallback}>
        <TestChild />
      </SuspenseFormWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders form with multiple input fields", () => {
    const FormChild = () => (
      <form data-testid="complex-form">
        <input type="text" placeholder="Artist" data-testid="artist-input" />
        <input type="text" placeholder="Album" data-testid="album-input" />
        <textarea placeholder="Notes" data-testid="notes-textarea"></textarea>
        <button type="submit">Save</button>
      </form>
    );

    render(
      <SuspenseFormWrapper>
        <FormChild />
      </SuspenseFormWrapper>
    );

    expect(screen.getByTestId("artist-input")).toBeInTheDocument();
    expect(screen.getByTestId("album-input")).toBeInTheDocument();
    expect(screen.getByTestId("notes-textarea")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders nested form elements correctly", () => {
    const NestedFormChild = () => (
      <form>
        <fieldset>
          <legend>Personal Info</legend>
          <input type="text" placeholder="Name" data-testid="name-input" />
        </fieldset>
      </form>
    );

    render(
      <SuspenseFormWrapper>
        <NestedFormChild />
      </SuspenseFormWrapper>
    );

    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });

  it("maintains form functionality with Suspense wrapper", () => {
    const FormChild = () => (
      <form data-testid="functional-form">
        <input type="text" placeholder="Test" data-testid="test-input" />
        <button type="submit" data-testid="submit-btn">Submit</button>
      </form>
    );

    render(
      <SuspenseFormWrapper>
        <FormChild />
      </SuspenseFormWrapper>
    );

    expect(screen.getByTestId("functional-form")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });
});
