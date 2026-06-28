import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import SuspenseStatsWrapper from "@components/ui/SuspenseStatsWrapper";

describe("SuspenseStatsWrapper", () => {
  it("renders children when they are ready", () => {
    const TestStatsChild = () => (
      <div data-testid="stats-content">
        <h3>Stats Section</h3>
        <p>Total: 100</p>
      </div>
    );

    render(
      <SuspenseStatsWrapper>
        <TestStatsChild />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("stats-content")).toBeInTheDocument();
    expect(screen.getByText("Stats Section")).toBeInTheDocument();
    expect(screen.getByText("Total: 100")).toBeInTheDocument();
  });

  it("renders Skeleton loading UI as default fallback", () => {
    const TestChild = () => <div data-testid="test-child">Ready</div>;

    render(
      <SuspenseStatsWrapper>
        <TestChild />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const TestChild = () => <div data-testid="test-child">Stats Content</div>;
    const CustomFallback = <div data-testid="custom-loading">Loading stats...</div>;

    render(
      <SuspenseStatsWrapper fallback={CustomFallback}>
        <TestChild />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders stats section with Paper and Container styling", () => {
    const TestStats = () => (
      <div data-testid="stats-section">
        <h4>Household Stats</h4>
        <div data-testid="stat-item">Vinyls Owned: 250</div>
      </div>
    );

    render(
      <SuspenseStatsWrapper>
        <TestStats />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("stats-section")).toBeInTheDocument();
    expect(screen.getByText("Household Stats")).toBeInTheDocument();
    expect(screen.getByTestId("stat-item")).toBeInTheDocument();
  });

  it("renders multiple stats sections independently", () => {
    const StatSection1 = () => (
      <div data-testid="section-1">
        <h3>Section 1</h3>
        <p>Data 1</p>
      </div>
    );
    const StatSection2 = () => (
      <div data-testid="section-2">
        <h3>Section 2</h3>
        <p>Data 2</p>
      </div>
    );

    const { rerender } = render(
      <SuspenseStatsWrapper>
        <StatSection1 />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("section-1")).toBeInTheDocument();

    rerender(
      <SuspenseStatsWrapper>
        <StatSection2 />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("section-2")).toBeInTheDocument();
  });

  it("wraps content in appropriate container structure", () => {
    const StatsContent = () => (
      <div data-testid="nested-stats">
        <div data-testid="stat-card">
          <h4>Top Artists</h4>
          <ul>
            <li>Artist 1</li>
            <li>Artist 2</li>
          </ul>
        </div>
      </div>
    );

    render(
      <SuspenseStatsWrapper>
        <StatsContent />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByTestId("nested-stats")).toBeInTheDocument();
    expect(screen.getByTestId("stat-card")).toBeInTheDocument();
    expect(screen.getByText("Artist 1")).toBeInTheDocument();
    expect(screen.getByText("Artist 2")).toBeInTheDocument();
  });

  it("handles stats with complex nested elements", () => {
    const ComplexStats = () => (
      <div data-testid="complex-stats">
        <table>
          <thead>
            <tr>
              <th>Album</th>
              <th>Plays</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Album A</td>
              <td>50</td>
            </tr>
            <tr>
              <td>Album B</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    render(
      <SuspenseStatsWrapper>
        <ComplexStats />
      </SuspenseStatsWrapper>
    );

    expect(screen.getByText("Album A")).toBeInTheDocument();
    expect(screen.getByText("Album B")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });
});
