import { test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/navbar";
import { FaBars, FaTimes } from "react-icons/fa";

// ✅ **TEST: Navbar renders correctly**
test("renders Navbar component", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByRole("navigation")).toBeInTheDocument();
});

// ✅ **TEST: Navbar contains expected navigation links**
test("navbar contains expected links", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute("href", "/getstarted");
  expect(screen.getByRole("link", { name: /menu/i })).toHaveAttribute("href", "/menu");
  expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
  expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
  expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
});

// ✅ **TEST: Clicking the menu button toggles the menu**
test("clicking the menu button toggles the menu", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const menuButton = screen.getByRole("button", { name: /toggle navigation menu/i });

  // Initially, the menu should be closed (FaBars should be visible)
  const initialIcon = menuButton.querySelector("svg");
  expect(initialIcon).toBeInTheDocument();
  expect(initialIcon.tagName).toBe("svg"); // Corrected to lowercase "svg" tag name

  // Click the menu button to open
  fireEvent.click(menuButton);
  const afterClickIcon = menuButton.querySelector("svg");
  expect(afterClickIcon).toBeInTheDocument();
  expect(afterClickIcon).not.toEqual(initialIcon); // FaBars and FaTimes are different elements

  // Click again to close
  fireEvent.click(menuButton);
  const afterSecondClickIcon = menuButton.querySelector("svg");
  expect(afterSecondClickIcon).toBeInTheDocument();
  expect(afterSecondClickIcon).toEqual(initialIcon); // FaBars should be visible again
});

// ✅ **TEST: Clicking logo navigates to home page**
test("clicking the logo navigates to home page", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const logoLink = screen.getByRole("link", { name: /plate tonic logo/i });

  expect(logoLink).toHaveAttribute("href", "/");
});

// ✅ **TEST: User login icon navigates to login page**
test("user login icon navigates to login page", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const loginLink = screen.getByRole("link", { name: /user login/i });

  expect(loginLink).toHaveAttribute("href", "/login");
});
