import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import type { PlayLog } from "@interfaces/PlayLog";
import type { Stats } from "@interfaces/Stats";
import PlaysByMonths from "@components/stats/sections/playlogs/PlaysByMonth";

const makePlaylog = (date: string): PlayLog => {
  const [year, month, day] = date.split("-").map(Number);

  return {
    album_id: null,
    date: new Date(year, month - 1, day),
    listeners: []
  };
};

const stats: Stats = {
  collectionValue: 0,
  playlogs: [
    makePlaylog("2023-01-10"),
    makePlaylog("2023-01-15"),
    makePlaylog("2023-02-20"),
    makePlaylog("2024-01-05"),
    makePlaylog("2024-03-01"),
    makePlaylog("2024-03-12")
  ],
  playsByAlbum: {},
  playsByArtist: {},
  playsByDays: {},
  playsByMonths: {
    March: 2,
    January: 3,
    February: 1
  },
  pricePaid: 0,
  topArtists: {},
  topLocations: {},
  topPlayDays: {},
  totalBought: 0,
  totalOwned: 0,
  totalPlays: 6
};

const renderSection = () => render(<PlaysByMonths stats={stats} expanded={true} onToggle={vi.fn()} />);

describe("PlaysByMonths", () => {
  it("renders the all-time monthly totals by default", () => {
    renderSection();

    expect(screen.getByText("All")).toBeInTheDocument();

    const currentView = screen.getByTestId("plays-by-month-current-view");
    const months = within(currentView).getAllByTitle(/^(January|February|March)$/);

    expect(months.map((month) => month.textContent)).toEqual(["January", "February", "March"]);
    expect(within(currentView).getByText("3")).toBeInTheDocument();
    expect(within(currentView).getByText("1")).toBeInTheDocument();
    expect(within(currentView).getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View previous play month grouping" })).toBeDisabled();
  });

  it("moves to the most recent year when the next button is clicked", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "View next play month grouping" }));

    expect(screen.getByText("2024")).toBeInTheDocument();

    const currentView = screen.getByTestId("plays-by-month-current-view");
    const months = within(currentView).getAllByTitle(/^(January|March)$/);

    expect(months.map((month) => month.textContent)).toEqual(["January", "March"]);
    expect(within(currentView).getByText("2")).toBeInTheDocument();
    expect(within(currentView).getByText("1")).toBeInTheDocument();
    expect(within(currentView).queryByTitle("February")).not.toBeInTheDocument();
    expect(currentView).toHaveAttribute("data-slide-direction", "left");
  });

  it("moves back to all-time totals when the previous button is clicked", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "View next play month grouping" }));
    fireEvent.click(screen.getByRole("button", { name: "View previous play month grouping" }));

    expect(screen.getByText("All")).toBeInTheDocument();

    const currentView = screen.getByTestId("plays-by-month-current-view");

    expect(within(currentView).getByTitle("March")).toBeInTheDocument();
    expect(currentView).toHaveAttribute("data-slide-direction", "right");
  });

  it("disables the next button on the last year", () => {
    renderSection();

    const nextButton = screen.getByRole("button", { name: "View next play month grouping" });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });
});