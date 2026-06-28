import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCombinedLoading } from "@hooks/useCombinedLoading";

describe("useCombinedLoading", () => {
  it("returns false when all loading states are false", () => {
    const { result } = renderHook(() => useCombinedLoading([false, false, false]));
    expect(result.current).toBe(false);
  });

  it("returns true when at least one loading state is true", () => {
    const { result } = renderHook(() => useCombinedLoading([false, true, false]));
    expect(result.current).toBe(true);
  });

  it("returns true when all loading states are true", () => {
    const { result } = renderHook(() => useCombinedLoading([true, true, true]));
    expect(result.current).toBe(true);
  });

  it("returns false with empty array", () => {
    const { result } = renderHook(() => useCombinedLoading([]));
    expect(result.current).toBe(false);
  });

  it("returns false with single false value", () => {
    const { result } = renderHook(() => useCombinedLoading([false]));
    expect(result.current).toBe(false);
  });

  it("returns true with single true value", () => {
    const { result } = renderHook(() => useCombinedLoading([true]));
    expect(result.current).toBe(true);
  });

  it("handles multiple true values", () => {
    const { result } = renderHook(() => useCombinedLoading([true, true, false]));
    expect(result.current).toBe(true);
  });

  it("works with dynamic array updates", () => {
    const { result, rerender } = renderHook(
      ({ loadingStates }: { loadingStates: boolean[] }) => useCombinedLoading(loadingStates),
      { initialProps: { loadingStates: [false, false] } }
    );

    expect(result.current).toBe(false);

    rerender({ loadingStates: [false, true] });
    expect(result.current).toBe(true);

    rerender({ loadingStates: [false, false] });
    expect(result.current).toBe(false);
  });
});
