import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AddressSearchMap } from "@components/locations/AddressSearchMap";

const { mockApiIsLoaded, mockFetchSuggestions, mockMap } = vi.hoisted(() => ({
  mockApiIsLoaded: vi.fn(),
  mockFetchSuggestions: vi.fn(),
  mockMap: {
    panTo: vi.fn(),
    setCenter: vi.fn(),
    setZoom: vi.fn(),
  },
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  Marker: () => <div data-testid="marker" />,
  useApiIsLoaded: mockApiIsLoaded,
  useMap: () => mockMap,
}));

const makeGoogle = () => ({
  maps: {
    places: {
      AutocompleteSessionToken: class {},
      AutocompleteSuggestion: { fetchAutocompleteSuggestions: mockFetchSuggestions },
    },
    Geocoder: class {
      geocode = vi.fn();
    },
  },
});

describe("AddressSearchMap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockApiIsLoaded.mockReturnValue(true);
    mockFetchSuggestions.mockReset();
    mockMap.panTo.mockReset();
    mockMap.setCenter.mockReset();
    mockMap.setZoom.mockReset();
    window.google = makeGoogle() as never;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows a loading state while the Maps API is unavailable", () => {
    mockApiIsLoaded.mockReturnValue(false);

    render(<AddressSearchMap initialAddress={null} onAddressSelect={vi.fn()} disabled={false} />);

    expect(screen.getByText("Loading Google Maps...")).toBeInTheDocument();
  });

  it("fetches and selects an address suggestion", async () => {
    const onAddressSelect = vi.fn();
    const place = {
      location: { lat: () => 51.5, lng: () => -0.12 },
      fetchFields: vi.fn(),
    };
    const suggestion = {
      placePrediction: {
        text: { toString: () => "10 Downing Street" },
        toPlace: vi.fn().mockResolvedValue(place),
      },
    };
    mockFetchSuggestions.mockResolvedValue({ suggestions: [suggestion] });

    render(<AddressSearchMap initialAddress={null} onAddressSelect={onAddressSelect} disabled={false} />);
    fireEvent.change(screen.getByPlaceholderText("Start typing an address..."), {
      target: { value: "10 Downing Street" },
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });

    expect(screen.getByText("10 Downing Street")).toBeInTheDocument();
    fireEvent.click(screen.getByText("10 Downing Street"));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onAddressSelect).toHaveBeenCalledWith("10 Downing Street", 51.5, -0.12);
    expect(mockMap.panTo).toHaveBeenCalledWith({ lat: 51.5, lng: -0.12 });
    expect(mockMap.setZoom).toHaveBeenCalledWith(17);
    expect(place.fetchFields).toHaveBeenCalledWith({ fields: ["location"] });
  });

  it("opens the current address in Google Maps", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<AddressSearchMap initialAddress="Berlin, Germany" onAddressSelect={vi.fn()} disabled={false} />);
    fireEvent.click(screen.getByRole("button"));

    expect(open).toHaveBeenCalledWith(
      "https://www.google.com/maps/search/?api=1&query=Berlin%2C%20Germany",
      "_blank",
      "noopener,noreferrer",
    );
  });
});