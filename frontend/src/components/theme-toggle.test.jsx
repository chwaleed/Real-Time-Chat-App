import { render, fireEvent } from "@testing-library/react";
import { ModeToggle } from "./theme-toggle";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";
import { vi } from "vitest";

// Mock the useTheme hook and ThemeProvider
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

describe("ModeToggle", () => {
  it("should toggle the theme when clicked", () => {
    const setTheme = vi.fn();
    useTheme.mockReturnValue({ theme: "light", setTheme });

    const { getByRole } = render(
      <ThemeProvider>
        <ModeToggle />
      </ThemeProvider>
    );

    const toggleButton = getByRole("button");
    fireEvent.click(toggleButton);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
