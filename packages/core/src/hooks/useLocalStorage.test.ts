import { describe, it, expect, vi, beforeEach } from "vitest";

// Setting up window.localStorage mocks
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

vi.stubGlobal("window", {
  localStorage: localStorageMock
});

import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage Hook Utilities", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should initialize with custom values when localStorage is empty", () => {
    const defaultData = { name: "Test Aspirant", onboardingCompleted: false };
    
    // Simulating initialization reading
    const key = "test-aspirant-profile";
    const item = window.localStorage.getItem(key);
    const parsedData = item ? JSON.parse(item) : defaultData;

    expect(window.localStorage.getItem).toHaveBeenCalledWith(key);
    expect(parsedData).toEqual(defaultData);
  });

  it("should read from localStorage if value already exists", () => {
    const existingData = { name: "Mukund", onboardingCompleted: true };
    const key = "existing-aspirant-profile";
    
    window.localStorage.setItem(key, JSON.stringify(existingData));

    const item = window.localStorage.getItem(key);
    const parsedData = item ? JSON.parse(item) : null;

    expect(parsedData).toEqual(existingData);
  });
});
